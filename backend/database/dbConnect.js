require('dotenv').config()

async function createConnection() {
    const mysql = require('mysql2/promise');
    const db = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        namedPlaceholders: true
    });

    return db;
}



module.exports = createConnection;