// db.js
const mysql = require("mysql2/promise");  // Use mysql2/promise
require("dotenv").config();

const pool = mysql.createPool({
     host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
});

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Failed to connect to MySQL database:', err.message);
  });

module.exports = pool;
