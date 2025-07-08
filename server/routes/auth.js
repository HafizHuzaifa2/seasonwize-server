const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await db.execute(
            'SELECT user_id, password_hash FROM sw_users WHERE username=:username',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user[1]);
        if (!match) {
            return res.status(401).send('Invalid username or password');
        }

        req.session.userId = user[0];
        res.json({ message: 'Login successful' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Login failed');
    }
});

module.exports = router;
