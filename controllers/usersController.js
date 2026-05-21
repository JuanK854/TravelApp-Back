const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

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
        const { name, username, bio } = req.body;
        const profile_picture = req.file ? req.file.path : null;

        const [current] = await db.query('SELECT profile_picture FROM users WHERE id = ?', [req.params.id]);
        if (current.length === 0) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });

        if (profile_picture && current[0].profile_picture) {
            const publicId = current[0].profile_picture.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        const [result] = await db.query(
            'UPDATE users SET name = ?, username = ?, profile_picture = ?, bio = ? WHERE id = ?',
            [name, username, profile_picture || current[0].profile_picture, bio || null, req.params.id]
        );

        if (result.affectedRows === 0) return res.status(404).json({ error: `No existe un usuario con id ${req.params.id}` });

        res.json({
            message: 'Usuario actualizado',
            profile_picture: profile_picture || current[0].profile_picture
        });
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