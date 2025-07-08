const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ Replace with your actual frontend Firebase URL
const allowedOrigin = 'https://search-3e930.web.app';

// ✅ CORS setup for normal + preflight (OPTIONS) requests
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight OPTIONS requests
app.options('*', cors({
    origin: allowedOrigin,
    credentials: true
}));

// ✅ Session setup (for authentication)
app.use(session({
    secret: 'Huzaifa', // 🔐 Use env var in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
        secure: true // Must be true for cookies to work with Firebase (HTTPS)
    }
}));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Serve static files if needed (e.g., local testing)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ ROUTES
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');

// ✅ Use routes
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
    console.log(`Server running on port ${PORT}`);
});
