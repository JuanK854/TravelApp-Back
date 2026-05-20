const db = require('../config/db');
const bcrypt = require('bcrypt');
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
            'SELECT * FROM USERS WHERE EMAIL = ? OR USERNAME = ?',
            [email, username]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                error: 'El email o username ya está registrado'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO USERS (EMAIL, NAME, USERNAME, PASWORD, PROFILE_PICTURE, BIO) VALUES (?, ?, ?, ?, ?, ?)',
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

        const [rows] = await db.query('SELECT * FROM USERS WHERE EMAIL = ?', [email]);

        if (rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const user = rows[0];

        const passwordOk = await bcrypt.compare(password, user.PASWORD);

        if (!passwordOk) {
            return res.status(401).json({
                error: 'Credenciales incorrectas'
            });
        }

        const token = jwt.sign(
            {
                id: user.ID,
                email: user.EMAIL,
                username: user.USERNAME
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.ID,
                name: user.NAME,
                username: user.USERNAME,
                email: user.EMAIL,
                profile_picture: user.PROFILE_PICTURE,
                bio: user.BIO
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