const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all orders
router.get('/', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM sw_orders');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching orders');
    }
});

// POST new order
router.post('/', async (req, res) => {
    const { shopify_order_id, product_id, quantity, selling_price, order_date } = req.body;
    try {
        await db.execute(
            'INSERT INTO sw_orders (shopify_order_id, product_id, quantity, selling_price, order_date) VALUES (:shop_id, :prod, :qty, :price, :odate)',
            [shopify_order_id, product_id, quantity, selling_price, order_date]
        );
        res.status(201).send('Order added');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding order');
    }
});

// DELETE an order
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM sw_orders WHERE order_id=:id', [id]);
        res.send('Order deleted');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting order');
    }
});

module.exports = router;
