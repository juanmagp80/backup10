const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
// api.js

const noticias = require('./api/noticias');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }); // Configura Multer para manejar la subida de archivos
const noticiasRouter = require('./api/noticias')(upload); // Pasa upload a tu módulo de rutas

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

// Utiliza body-parser para analizar el cuerpo de las solicitudes JSON y URL codificadas
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});

app.use('/noticias', noticiasRouter); // Utiliza el router de noticias

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});