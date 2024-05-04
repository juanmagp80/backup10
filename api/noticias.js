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
    user: 'juanma',
    host: 'localhost',
    database: 'barca10',
    password: 'solano28',
    port: 5432,
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

            // Desestructura req.body y agrega la URL de la imagen de Cloudinary
            const { titulo, descripcion, fecha } = req.body;
            const noticia = { titulo, descripcion, fecha, imagen: result.secure_url };

            // Guarda la noticia en tu base de datos
            const query = 'INSERT INTO noticias(titulo, descripcion, fecha, imagen) VALUES($1, $2, $3, $4)';
            const values = [noticia.titulo, noticia.descripcion, noticia.fecha, noticia.imagen];
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