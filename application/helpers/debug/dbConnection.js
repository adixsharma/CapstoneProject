require("dotenv").config({ path: '../../.env' });
const pool = require("../../conf/database");

console.log('Environment variables loaded:');
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

async function testConnection() {
    try {
        const connection = await pool.getConnection();

        console.log('Connection successful!');

        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Call the testConnection function
testConnection();