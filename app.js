const express = require('express');
const cors = require('cors');
const session = require('express-session');
const app = express();

// Replace with your actual Firebase Hosting domain
const FRONTEND_ORIGIN = 'https://seasonwize-6c213.web.app';

// CORS Configuration
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true, // Allow cookies/sessions
}));

// Session Configuration
app.use(session({
    secret: 'Huzaifa',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // true if using HTTPS
        sameSite: 'None' // must be 'None' for cross-origin cookies
    }
}));

app.use(express.json());
app.use(express.static('public'));

// Your Routes
const productsRoutes = require('./server/routes/products');
const ordersRoutes = require('./server/routes/orders');
const expensesRoutes = require('./server/routes/expenses');
const suppliersRoutes = require('./server/routes/suppliers');
const authRoutes = require('./server/routes/auth');
const reportsRoutes = require('./server/routes/reports');
const settingsRoutes = require('./server/routes/settings');
const dashboardRoutes = require('./server/routes/dashboard');

// Mount Routes
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
