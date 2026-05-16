const db = require('../config/db');
const cloudinary = require('../config/cloudinary');

const getPosts = async (req, res) => {
    try {
        const { user_id } = req.query;

        const query = `
            SELECT p.*, u.name, u.username, u.profile_picture,
            l.city, l.country
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN locations l ON p.id = l.post_id
            ${user_id ? 'WHERE p.user_id = ?' : ''}
            ORDER BY p.created_at DESC
        `;

        const [posts] = await db.query(query, user_id ? [user_id] : []);

        for (const post of posts) {
            const [media] = await db.query('SELECT url, type FROM post_media WHERE post_id = ?', [post.id]);
            post.media = media;
        }

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener posts' });
    }
};

const getPostById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, u.name, u.username, u.profile_picture,
            l.city, l.country
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN locations l ON p.id = l.post_id
            WHERE p.id = ?
        `, [req.params.id]);

        if (rows.length === 0) return res.status(404).json({ error: `No existe un post con id ${req.params.id}` });

        const [media] = await db.query('SELECT url, type FROM post_media WHERE post_id = ?', [req.params.id]);
        res.json({ ...rows[0], media });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener post' });
    }
};

const createPost = async (req, res) => {
    try {
        const { title, description, city, country } = req.body;
        const user_id = req.user.id;

        if (!title || !description)
            return res.status(400).json({ error: 'title y description son obligatorios' });

        const [result] = await db.query(
            'INSERT INTO posts (user_id, title, description) VALUES (?, ?, ?)',
            [user_id, title, description]
        );

        const post_id = result.insertId;

        if (city || country) {
            await db.query(
                'INSERT INTO locations (post_id, city, country) VALUES (?, ?, ?)',
                [post_id, city || null, country || null]
            );
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await db.query(
                    'INSERT INTO post_media (post_id, url, type) VALUES (?, ?, ?)',
                    [post_id, file.path, 'image']
                );
            }
        }

        res.status(201).json({ message: 'Post creado', id: post_id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear post' });
    }
};

const updatePost = async (req, res) => {
    try {
        const { title, description } = req.body;
        const [result] = await db.query(
            'UPDATE posts SET title = ?, description = ? WHERE id = ? AND user_id = ?',
            [title, description, req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Post no encontrado o no autorizado' });
        res.json({ message: 'Post actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar post' });
    }
};

const deletePost = async (req, res) => {
    try {
        const [media] = await db.query('SELECT url, type FROM post_media WHERE post_id = ?', [req.params.id]);

        for (const file of media) {
            const publicId = file.url.split('/').slice(-2).join('/').split('.')[0];
            await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        }

        const [result] = await db.query(
            'DELETE FROM posts WHERE id = ? AND user_id = ?',
            [req.params.id, req.user.id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Post no encontrado o no autorizado' });
        res.json({ message: 'Post eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar post' });
    }
};

module.exports = { getPosts, getPostById, createPost, updatePost, deletePost };