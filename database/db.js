// db.js
const mysql = require("mysql2/promise");  // Use mysql2/promise
require("dotenv").config();

const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection()
  .then(connection => {
    console.log('Successfully connected to MySQL database!');
    connection.release();
  })
  .catch(err => {
    console.error('Failed to connect to MySQL database:', err.message);
  });

module.exports = pool;