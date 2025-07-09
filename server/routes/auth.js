const express = require('express');
const router = express.Router();
const db = require('../config/db'); // make sure this exports a working DB connection
const bcrypt = require('bcrypt');  // Ensure this is installed with: npm install bcrypt

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt by:', username);

    try {
        // Adjust this if using PostgreSQL/Oracle — make sure table name & column names match
        const result = await db.execute(
            'SELECT user_id, password_hash FROM sw_users WHERE username = :username',
            [username]
        );

        if (!result || !result.rows || result.rows.length === 0) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.rows[0]; // array or object depending on DB client

        const passwordHash = user.password_hash || user[1];  // adjust based on db client
        const userId = user.user_id || user[0];

        const isMatch = await bcrypt.compare(password, passwordHash);

        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Session logic if needed (e.g., req.session.user = userId)
        console.log('Login successful:', userId);
        return res.json({ message: 'Login successful', userId: userId });

    } catch (err) {
        console.error('Login failed due to error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Optional logout route
router.post('/logout', (req, res) => {
    // Destroy session if used
    req.session?.destroy(() => {
        res.json({ message: 'Logged out' });
    });
});

module.exports = router;
