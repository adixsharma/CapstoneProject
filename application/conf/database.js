require("dotenv").config({ path: '../.env' });
const mysql = require("mysql2");

const pool = mysql
    .createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        ssl: {
            rejectUnauthorized: false,
        },
    })
    .promise();

module.exports = pool;