const express = require('express');

const app = express();

app.get('/noticias', (req, res) => {
    // Aquí va el código para obtener las noticias
    res.json({ message: 'Hola desde la API de noticias!' });
});

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});