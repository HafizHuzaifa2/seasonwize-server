const express = require('express');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Put your deployed Firebase frontend URL here
const allowedOrigin = 'https://search-3e930.web.app';

app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors({
    origin: allowedOrigin,
    credentials: true
}));

// ✅ Enable JSON parsing
app.use(express.json());

// ✅ Enable session with secure settings
app.use(session({
    secret: 'Huzaifa',
    resave: false,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
        secure: true
    }
}));

// ✅ ROUTES
app.use('/api/auth', require('./server/routes/auth'));
app.use('/api/products', require('./server/routes/products'));
app.use('/api/orders', require('./server/routes/orders'));
app.use('/api/expenses', require('./server/routes/expenses'));
app.use('/api/suppliers', require('./server/routes/suppliers'));
app.use('/api/reports', require('./server/routes/reports'));
app.use('/api/settings', require('./server/routes/settings'));
app.use('/api/dashboard', require('./server/routes/dashboard'));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
