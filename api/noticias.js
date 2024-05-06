const express = require('express');
const { Pool } = require('pg');
const cloudinary = require('cloudinary').v2;

// Configura Cloudinary
cloudinary.config({
    cloud_name: 'dujuw6skd',
    api_key: '841337476838722',
    api_secret: 'OQmok7BwKTGWe0m01fxPom2a_SQ'
});

// Crea una nueva instancia de Pool de pg
const pool = new Pool({
    // Aquí van tus configuraciones de la base de datos
    user: 'uamoj6t0idc5nd',
    host: 'cb5ajfjosdpmil.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
    database: 'de30ho0q6rd2j8',
    password: 'peaf4d8b947bbb3004aec27d7738a396407428da61e5d42c89206d06447574ea4',
    port: 5432,
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = (upload) => {
    const noticiasRouter = express.Router();

    noticiasRouter.post('/', upload.single('file'), async (req, res) => {
        if (!req.file) {
            return res.status(400).send('No se subió ningún archivo');
        }
        try {
            // Sube el archivo a Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);
            if (!req.body) {
                return res.status(400).send('Faltan datos en la solicitud');
            }

            // Desestructura req.body y agrega la URL de la imagen de Cloudinary
            const { titulo, descripcion, fecha, redactor } = req.body;
            const noticia = { titulo, descripcion, fecha, redactor, imagen: result.secure_url };

            if (!titulo || !descripcion || !fecha || !redactor) {
                return res.status(400).send('Faltan datos en la solicitud');
            }

            // Guarda la noticia en tu base de datos
            const query = 'INSERT INTO noticias(titulo, descripcion, fecha, redactor, imagen) VALUES($1, $2, $3, $4, $5)';
            const values = [noticia.titulo, noticia.descripcion, noticia.fecha, noticia.redactor, noticia.imagen];
            await pool.query(query, values);

            res.status(200).json(noticia);
        } catch (error) {
            console.error(error);

            res.status(500).json({ error: error.toString() });
        }
    });

    noticiasRouter.get('/', async (req, res) => {
        try {
            // Obtiene las noticias de tu base de datos
            const response = await pool.query('SELECT * FROM noticias');

            res.status(200).json(response.rows);
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });

    return noticiasRouter;
};