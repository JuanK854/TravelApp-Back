const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { email, name, username, password, profile_picture, bio } = req.body;

        if (!email || !name || !username || !password) {
            return res.status(400).json({
                error: 'Email, nombre, username y contraseña son obligatorios'
            });
        }

        const [existingUser] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                error: 'El email o username ya está registrado'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (email, name, username, password, profile_picture, bio) VALUES (?, ?, ?, ?, ?, ?)',
            [email, name, username, hashedPassword, profile_picture || null, bio || null]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: result.insertId,
                name,
                username,
                email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al registrar usuario'
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son obligatorios'
            });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const user = rows[0];

        const passwordOk = await bcrypt.compare(password, user.password);

        if (!passwordOk) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                profile_picture: user.profile_picture,
                bio: user.bio
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al iniciar sesión'
        });
    }
};

module.exports = { register, login };