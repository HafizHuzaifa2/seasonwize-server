const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// ✅ CORS Middleware
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://search-3e930.web.app'], // ✅ Your actual Firebase frontend domain
    credentials: true
}));
// Route imports
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');

// ✅ Session Middleware (secure config for production)
app.use(session({
    secret: process.env.SESSION_SECRET || 'Huzaifa', // 🔒 use env in production
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'none',  // 🔁 Needed for cross-site (Firebase frontend, Railway backend)
        secure: true        // ✅ Must be true when using HTTPS (Firebase, Railway)
    }
}));


// ✅ Other Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// ✅ API Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
