require('dotenv').config();
const express = require('express');
const db = require('./config/db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.use('/locations', require('./routes/locations'));
app.use('/comments', require('./routes/comments'));

const testDBConnectionAndStart = async () => {
    try {
        await db.query('SELECT 1');
        console.log('Conexión a la base de datos exitosa');
        app.listen(process.env.PORT || 3010, () => {
            console.log(`Servidor escuchando en el puerto ${process.env.PORT || 3010}`);
        });
    } catch (error) {
        console.error('Error con la db', error.message);
        process.exit(1);
    }
};

testDBConnectionAndStart();