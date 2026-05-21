const db = require('../config/db');

const getLocations = async (req, res) => {
    try {
        const [locations] = await db.query('SELECT * FROM locations');
        res.json(locations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener locations' });
    }
};

const getLocationById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener location' });
    }
};

const createLocation = async (req, res) => {
    try {
        const { post_id, city, country } = req.body;
        if (!post_id) return res.status(400).json({ error: 'post_id es obligatorio' });

        const [result] = await db.query(
            'INSERT INTO locations (post_id, city, country) VALUES (?, ?, ?)',
            [post_id, city || null, country || null]
        );
        res.status(201).json({ message: 'Location creada', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear location' });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { city, country } = req.body;
        const [result] = await db.query(
            'UPDATE locations SET city = ?, country = ? WHERE id = ?',
            [city || null, country || null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });
        res.json({ message: 'Location actualizada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar location' });
    }
};

const deleteLocation = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM locations WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: `No existe una location con id ${req.params.id}` });
        res.json({ message: 'Location eliminada' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar location' });
    }
};

module.exports = { getLocations, getLocationById, createLocation, updateLocation, deleteLocation };