const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received:', username, password);

    try {
        const result = await db.execute(
            'SELECT user_id, password_hash FROM sw_users WHERE username = :username',
            [username]
        );

        if (result.rows.length === 0) {
            console.log('User not found');
            return res.status(401).send('Invalid username or password');
        }

        const user = result.rows[0];
        const userId = user[0];
        const hashedPassword = user[1];

        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (!isMatch) {
            console.log('Incorrect password');
            return res.status(401).send('Invalid username or password');
        }

        // You can store session info here if needed
        req.session.userId = userId;

        res.json({ message: 'Login successful', userId });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Login failed');
    }
});

module.exports = router;
