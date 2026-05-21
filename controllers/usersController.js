const db = require('../config/db');

const getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, name, username, profile_picture, bio, created_at FROM users');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const getUserById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, email, name, username, profile_picture, bio, created_at FROM users WHERE id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, username, profile_picture, bio } = req.body;
        const [result] = await db.query(
            'UPDATE users SET name = ?, username = ?, profile_picture = ?, bio = ? WHERE id = ?',
            [name, username, profile_picture || null, bio || null, req.params.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });
        res.json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };