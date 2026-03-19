const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pi_proyecto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verificar conexión al inicio
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
    } else {
        console.log('Conectado a MySQL exitosamente');
        connection.release();
    }
});

module.exports = pool.promise();