const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS Setup for Firebase
app.use(cors({
    origin: 'https://seasonwize-6c213.web.app', // ✅ Your Firebase frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true // ✅ allow cookies/session across domains
}));

// ✅ Session setup (if you're using session login)
app.use(session({
    secret: 'Huzaifa', // change this to a strong secret key
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
        secure: true // true for HTTPS (Firebase uses HTTPS)
    }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ✅ Routes
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');

app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
