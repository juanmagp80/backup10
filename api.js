const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const noticiasRouter = require('./api/noticias');

const app = express();
app.use(cors());
app.options('*', cors());  // enable pre-flight request for all routes
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use('/noticias', noticiasRouter);

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});