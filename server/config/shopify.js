const express = require('express');
const router = express.Router();
const db = require('./db');
const axios = require('axios');

const SHOPIFY_STORE_URL = 'https://your-store.myshopify.com';
const SHOPIFY_ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

// Fetch products from Shopify and save/update in Oracle DB
router.get('/sync-products', async (req, res) => {
    try {
        const response = await axios.get(`${SHOPIFY_STORE_URL}/admin/api/2023-04/products.json`, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        const products = response.data.products;

        // Loop through Shopify products
        for (let p of products) {
            const name = p.title;
            const cost_price = 0; // Shopify doesn't store cost price
            const selling_price = p.variants[0].price;
            const stock = p.variants[0].inventory_quantity;

            // Insert or update in Oracle DB (simple example)
            await db.execute(
                `MERGE INTO sw_products p
         USING (SELECT :name AS name FROM dual) d
         ON (p.name = d.name)
         WHEN MATCHED THEN
           UPDATE SET selling_price = :price, stock = :stock
         WHEN NOT MATCHED THEN
           INSERT (name, cost_price, selling_price, stock)
           VALUES (:name, :cost, :price, :stock)`,
                [name, selling_price, stock, name, cost_price, selling_price, stock]
            );
        }
        res.json({ message: 'Products synced successfully', count: products.length });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error syncing products');
    }
});

// Fetch orders from Shopify and save in Oracle DB
router.get('/sync-orders', async (req, res) => {
    try {
        const response = await axios.get(`${SHOPIFY_STORE_URL}/admin/api/2023-04/orders.json`, {
            headers: {
                'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        });
        const orders = response.data.orders;

        for (let o of orders) {
            const shopify_order_id = o.id;
            const line_item = o.line_items[0];
            const product_name = line_item.title;
            const quantity = line_item.quantity;
            const selling_price = line_item.price;
            const order_date = o.created_at;

            // Insert order (without duplicate check here)
            await db.execute(
                `INSERT INTO sw_orders (shopify_order_id, product_id, quantity, selling_price, order_date)
         VALUES (:shop_id, (
           SELECT product_id FROM sw_products WHERE name=:prodname
         ), :qty, :price, TO_DATE(:odate, 'YYYY-MM-DD"T"HH24:MI:SS'))`,
                [shopify_order_id, product_name, quantity, selling_price, order_date]
            );
        }
        res.json({ message: 'Orders synced successfully', count: orders.length });
    } catch (err) {
        console.error(err.response?.data || err);
        res.status(500).send('Error syncing orders');
    }
});

module.exports = router;
