const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt'); // password hash check

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username, password);
    try {
        const result = await db.execute(
            'SELECT user_id, password_hash FROM sw_users WHERE username=:username',
            [username]
        );
        if (result.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user[1]);
        // console.log(isMatch);
        if (!isMatch) {
            return res.status(401).send('Invalid username or password');
        }
        // TODO: issue session or JWT, simplified here:
        res.json({ message: 'Login successful', userId: user[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Login failed');
        alert("Login fail");
    }
});

// POST /api/auth/logout (if you implement sessions/JWT)
router.post('/logout', (req, res) => {
    // TODO: clear session or token
    res.json({ message: 'Logged out' });
});

module.exports = router;
