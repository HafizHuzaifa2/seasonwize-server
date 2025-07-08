const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS: Allow Firebase frontend
app.use(cors({
    origin: 'https://search-3e930.web.app', // ✅ your Firebase frontend
    credentials: true
}));

// ✅ Preflight CORS handler for OPTIONS requests
app.options('*', cors({
    origin: 'https://search-3e930.web.app',
    credentials: true
}));

// ✅ Body parser
app.use(express.json());

// ✅ Session middleware
app.use(session({
    secret: 'Huzaifa', // 🔐 Replace with secure value in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',  // required for cross-origin sessions
        secure: true       // required for HTTPS (Railway)
    }
}));

// ✅ Static public folder (for frontend hosting if needed)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Import all routes
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');

// ✅ Mount all routes
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
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
