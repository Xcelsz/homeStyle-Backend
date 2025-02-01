// db.js
const mysql = require("mysql2/promise");  // Use mysql2/promise

const pool = mysql.createPool({
  host: "localhost", // Replace with your DB host
  user: 'root',
  password: 'Xs_shellsz202322',
  database: "homeStyle", // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 20, // Adjust based on your needs
  queueLimit: 0
});

module.exports = pool;

