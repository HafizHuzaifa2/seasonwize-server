const express = require('express');
const app = express();
const cors = require('cors');
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');
// const shopifyRoutes = require('./routes/shopify');
const path = require('path');

const allowedOrigins = ['https://seasonwize-6c213.web.app', 'http://localhost:5500'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


// For preflight
app.options('*', cors());



app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
// app.use(express.static('../public')); // serve static HTML/CSS/JS
// app.use('/api/shopify', shopifyRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);




// Routes
app.use('/api/products', productsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Admin panel running at http://0.0.0.0:${PORT}`);
});



