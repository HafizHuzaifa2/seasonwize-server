const express = require('express');
const router = express.Router();
const db = require('../config/db');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');

// GET /api/reports?from=2025-01-01&to=2025-07-31
router.get('/', async (req, res) => {
  const { from, to } = req.query;
  try {
    const filters = [];
    if (from) filters.push(`order_date >= TO_DATE('${from}', 'YYYY-MM-DD')`);
    if (to) filters.push(`order_date <= TO_DATE('${to}', 'YYYY-MM-DD')`);
    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const salesQuery = `
      SELECT TO_CHAR(order_date, 'YYYY-MM') AS month, SUM(selling_price * quantity) AS sales
      FROM sw_orders ${where} GROUP BY TO_CHAR(order_date, 'YYYY-MM') ORDER BY month
    `;
    const expenseQuery = `
      SELECT TO_CHAR(expense_date, 'YYYY-MM') AS month, SUM(amount) AS expenses
      FROM sw_expenses ${where.replace(/order_date/g, 'expense_date')}
      GROUP BY TO_CHAR(expense_date, 'YYYY-MM') ORDER BY month
    `;

    const [salesResult, expenseResult] = await Promise.all([
      db.execute(salesQuery),
      db.execute(expenseQuery)
    ]);

    const salesMap = new Map(salesResult.rows.map(row => [row[0], row[1]]));
    const expenseMap = new Map(expenseResult.rows.map(row => [row[0], row[1]]));

    const months = Array.from(new Set([...salesMap.keys(), ...expenseMap.keys()])).sort();

    const salesData = months.map(m => salesMap.get(m) || 0);
    const expenseData = months.map(m => expenseMap.get(m) || 0);
    const profitData = months.map((_, i) => salesData[i] - expenseData[i]);

    res.json({
      labels: months,
      salesData,
      expenseData,
      profitData
    });

  } catch (err) {
    console.error('Reports API error:', err);
    res.status(500).send('Failed to load reports');
  }
});


// Export CSV
router.get('/export/csv', async (req, res) => {
  try {
    const query = `
      SELECT o.order_id, o.order_date, p.name, o.quantity, o.selling_price,
             (o.quantity * o.selling_price) AS total,
             e.amount AS expense, e.category, e.expense_date
      FROM sw_orders o
      JOIN sw_products p ON o.product_id = p.product_id
      LEFT JOIN sw_expenses e ON TO_CHAR(o.order_date, 'YYYY-MM-DD') = TO_CHAR(e.expense_date, 'YYYY-MM-DD')
      ORDER BY o.order_date DESC
    `;

    const result = await db.execute(query);
    const fields = ['ORDER_ID', 'ORDER_DATE', 'NAME', 'QUANTITY', 'SELLING_PRICE', 'TOTAL', 'EXPENSE', 'CATEGORY', 'EXPENSE_DATE'];
    const parser = new Parser({ fields });
    const csv = parser.parse(result.rows.map(r => ({
      ORDER_ID: r[0],
      ORDER_DATE: r[1],
      NAME: r[2],
      QUANTITY: r[3],
      SELLING_PRICE: r[4],
      TOTAL: r[5],
      EXPENSE: r[6],
      CATEGORY: r[7],
      EXPENSE_DATE: r[8]
    })));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
    res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).send('Failed to export CSV');
  }
});


// Export PDF
router.get('/export/pdf', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT TO_CHAR(order_date, 'YYYY-MM') AS month, 
             SUM(selling_price * quantity) AS sales
      FROM sw_orders GROUP BY TO_CHAR(order_date, 'YYYY-MM') ORDER BY month
    `);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="report.pdf"');
    doc.pipe(res);

    doc.fontSize(18).text('Sales Report (Monthly)', { align: 'center' }).moveDown();
    doc.fontSize(12);

    result.rows.forEach(([month, sales]) => {
      doc.text(`${month}: PKR ${sales}`);
    });

    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).send('Failed to export PDF');
  }
});

module.exports = router;
