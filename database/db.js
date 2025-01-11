// db.js
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // Replace with your DB host
  user: 'root',
  password: 'Xs_shellsz202322',
  database: "homestyle", // Replace with your DB name
  waitForConnections: true,
  connectionLimit: 20, // Adjust based on your needs
  queueLimit: 0
});

// Keep-alive mechanism: Ping the database at regular intervals to prevent idle timeout
setInterval(() => {
  pool.query('SELECT 1', (err) => {
    if (err) {
      console.error('Error pinging the database to keep the connection alive:', err);
    }
  });
}, 180000); // Ping every 3 minutes (180,000 ms)

module.exports = pool;
