const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all expenses
router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM sw_expenses ORDER BY expense_date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching expenses');
    }
});

// POST new expense
router.post('/', async (req, res) => {
    const { category, amount, expense_date, description } = req.body;
    try {
        await db.execute(
            `INSERT INTO sw_expenses (category, amount, expense_date, description)
             VALUES (:cat, :amt, TO_DATE(:edate, 'YYYY-MM-DD'), :descr)`,
            {
                cat: category,
                amt: amount,
                edate: expense_date,
                descr: description
            }
        );
        res.status(201).send('Expense added');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding expense');
    }
});

// PUT (update) an expense
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { category, amount, expense_date, description } = req.body;
    try {
        await db.execute(
            `UPDATE sw_expenses
             SET category = :cat,
                 amount = :amt,
                 expense_date = TO_DATE(:edate, 'YYYY-MM-DD'),
                 description = :descr
             WHERE expense_id = :id`,
            {
                cat: category,
                amt: amount,
                edate: expense_date,
                descr: description,
                id
            }
        );
        res.send('Expense updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating expense');
    }
});

// DELETE an expense
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM sw_expenses WHERE expense_id = :id', { id });
        res.send('Expense deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting expense');
    }
});

module.exports = router;
