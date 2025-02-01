const pool = require('../../../database/db');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    const { username, password, company, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // First, check if the username already exists
        const [results] = await pool.execute('SELECT * FROM AdminUser WHERE username = ?', [username]);

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Proceed to hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO AdminUser (username, password, company, role) VALUES (?, ?, ?, ?)';

        await pool.execute(insertQuery, [username, hashedPassword, company, role]);

        // If no error, send a success response
        return res.status(201).json({ message: 'Admin user registered successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Use pool.execute to run the query asynchronously
        const [results] = await pool.execute('SELECT * FROM AdminUser WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id }, 'your_secret_key_here', { expiresIn: '24h' });

        // Respond with the token
        return res.status(200).json({ token,user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Database error', error: error.message });
    }
};



exports.getUserData = async (req, res) => {
    const token = req.headers['authorization']; // Token should be sent in the Authorization header, e.g., Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    try {
        // Remove "Bearer " prefix if it's there
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

        // Verify and decode the token
        const decoded = jwt.verify(tokenWithoutBearer, 'your_secret_key_here');

        // Extract user id from the decoded token
        const userId = decoded.id;

        // Fetch the user data from the database using the user ID
        const [user] = await pool.execute('SELECT id, username, company, role FROM AdminUser WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data (e.g., username)
        return res.status(200).json(user[0]);

    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
};
