const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all suppliers
router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM sw_suppliers');
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch suppliers:', err);
        res.status(500).send('Error fetching suppliers');
    }
});

// POST new supplier
router.post('/', async (req, res) => {
    const { name, contacts } = req.body;

    console.log('Incoming data:', { name, contacts }); // 👈 Log to check

    try {
        await db.execute(
            `INSERT INTO sw_suppliers (name, contact_info) VALUES (:name, :contact_info)`,
            {
                name,
                contact_info: contacts   // 👈 Must map contact to contact_info
            },
            { autoCommit: true }
        );

        res.send('Supplier added successfully');
    } catch (err) {
        console.error('Failed to insert supplier:', err);
        res.status(500).send('Error adding supplier');
    }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
    try {
        await db.execute(
            `DELETE FROM sw_suppliers WHERE supplier_id = :id`,
            { id: req.params.id },
            { autoCommit: true }
        );
        res.send('Supplier deleted');
    } catch (err) {
        console.error('Delete supplier failed:', err);
        res.status(500).send('Error deleting supplier');
    }
});

module.exports = router;
