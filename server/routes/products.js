const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/products - list all products
router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM sw_products');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to fetch products');
    }
});

// POST /api/products - add new product
router.post('/', async (req, res) => {
    const { name, cost_price, selling_price, stock } = req.body;
    try {
        await db.execute(
            'INSERT INTO sw_products (name, cost_price, selling_price, stock) VALUES (:name, :cost, :sell, :stock)',
            [name, cost_price, selling_price, stock]
        );
        res.status(201).send('Product added');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to add product');
    }
});

// PUT /api/products/:id - update product
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { name, cost_price, selling_price, stock } = req.body;
    try {
        await db.execute(
            `UPDATE sw_products SET name=:name, cost_price=:cost, selling_price=:sell, stock=:stock WHERE product_id=:id`,
            [name, cost_price, selling_price, stock, id]
        );
        res.send('Product updated');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to update product');
    }
});

// DELETE /api/products/:id - delete product
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM sw_products WHERE product_id=:id', [id]);
        res.send('Product deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to delete product');
    }
});

module.exports = router;
