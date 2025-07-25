// db.js
const mysql = require("mysql2/promise");  // Use mysql2/promise
const config = require("./config.js");
require("dotenv").config();

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  connectionLimit: config.database.connectionLimit,
  acquireTimeout: config.database.acquireTimeout,
  timeout: config.database.timeout,
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
