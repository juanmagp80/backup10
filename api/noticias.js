// api/noticias.js
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const router = express.Router();

const pool = new Pool({
    user: 'juanma',
    host: 'localhost',
    database: 'barca10',
    password: 'solano28',
    port: 5432,
});

router.post('/', async (req, res) => {
    const { titulo, descripcion, redactor, fecha, imagen } = req.body;
    const response = await pool.query('INSERT INTO noticias (titulo, descripcion, redactor, fecha, imagen) VALUES ($1, $2, $3, $4, $5)', [titulo, descripcion, redactor, fecha, imagen]);
    res.json({ message: 'Noticia insertada exitosamente.' });
});

router.get('/', async (req, res) => {
    const response = await pool.query('SELECT * FROM noticias');
    res.json(response.rows);
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, redactor, fecha, imagen } = req.body;
    const response = await pool.query('UPDATE noticias SET titulo = $1, descripcion = $2, redactor = $3, fecha = $4, imagen = $5 WHERE id = $6', [titulo, descripcion, redactor, fecha, imagen, id]);
    res.json(`Noticia con ID: ${id} actualizada exitosamente.`);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const response = await pool.query('DELETE FROM noticias WHERE id = $1', [id]);
    res.json(`Noticia con ID: ${id} eliminada exitosamente.`);
});

module.exports = router;