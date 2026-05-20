const express = require('express');
const db = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

const testDBConnectionAndStart = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Conexión a la base de datos exitosa');
        app.listen(3010, () => {
            console.log('Servidor escuchando en el puerto 3010');
        });
    } catch (error) {
        console.error('Error con la db', error.message);
        process.exit(1);
    }
};

testDBConnectionAndStart();