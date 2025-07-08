const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/dashboard
router.get('/', async (req, res) => {
    try {
        // Today's Sales
        const todayResult = await db.execute(`
            SELECT NVL(SUM(SELLING_PRICE * QUANTITY), 0) AS todaysSales 
            FROM sw_orders 
            WHERE TRUNC(ORDER_DATE) = TRUNC(SYSDATE)
        `);

        // Monthly Profit (assuming profit = selling - cost * quantity)
        const profitResult = await db.execute(`
            SELECT NVL(SUM((p.SELLING_PRICE - p.COST_PRICE) * o.QUANTITY), 0) AS monthlyProfit
            FROM sw_orders o
            JOIN sw_products p ON o.PRODUCT_ID = p.PRODUCT_ID
            WHERE TO_CHAR(o.ORDER_DATE, 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')
        `);

        // Total Monthly Expenses
        const expenseResult = await db.execute(`
            SELECT NVL(SUM(AMOUNT), 0) AS totalExpenses
            FROM sw_expenses
            WHERE TO_CHAR(EXPENSE_DATE, 'YYYY-MM') = TO_CHAR(SYSDATE, 'YYYY-MM')
        `);

        // Sales chart (monthly total)
        const chartResult = await db.execute(`
            SELECT TO_CHAR(ORDER_DATE, 'Mon') AS month, SUM(SELLING_PRICE * QUANTITY) AS total
            FROM sw_orders
            GROUP BY TO_CHAR(ORDER_DATE, 'Mon'), TO_CHAR(ORDER_DATE, 'MM')
            ORDER BY TO_CHAR(ORDER_DATE, 'MM')
        `);

        const salesChart = {
            labels: chartResult.rows.map(row => row[0]),
            data: chartResult.rows.map(row => row[1])
        };

        res.json({
            todaysSales: todayResult.rows[0][0],
            monthlyProfit: profitResult.rows[0][0],
            totalExpenses: expenseResult.rows[0][0],
            salesChart
        });

    } catch (err) {
        console.error("Dashboard error:", err);
        res.status(500).send("Dashboard data fetch failed");
    }
});

module.exports = router;
