const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET current settings
router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM sw_settings WHERE id = 1');
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load settings');
    }
});

// POST to update settings
router.post('/', async (req, res) => {
    const { storeName, apiKey, apiSecret } = req.body;
    try {
        await db.execute(
            `UPDATE sw_settings 
             SET store_name = :store, 
                 shopify_api_key = :key, 
                 shopify_api_secret = :secret 
             WHERE id = 1`,
            [storeName, apiKey, apiSecret]
        );
        res.send('Settings updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating settings');
    }
});

module.exports = router;
