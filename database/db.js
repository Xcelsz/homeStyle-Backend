// db.js
const mysql = require("mysql2/promise");  // Use mysql2/promise
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Replace with your DB host
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 20, // Adjust based on your needs
  queueLimit: 0
});

module.exports = pool;

