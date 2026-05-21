const db = require('../config/db');

const getComments = async (req, res) => {
    try {
        const [comments] = await db.query(`
            SELECT c.*, u.name, u.username, u.profile_picture
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `, [req.params.post_id]);
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};

const createComment = async (req, res) => {
    try {
        const { content } = req.body;
        const user_id = req.user.id;
        const post_id = req.params.post_id;

        if (!content) return res.status(400).json({ error: 'content es obligatorio' });

        const [result] = await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );
        res.status(201).json({ message: 'Comentario creado', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear comentario' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM comments WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Comentario no encontrado o no autorizado' });
        res.json({ message: 'Comentario eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar comentario' });
    }
};

module.exports = { getComments, createComment, deleteComment };