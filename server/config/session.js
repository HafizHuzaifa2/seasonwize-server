const session = require('express-session');

module.exports = session({
    secret: 'seasonwizeSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true only if you're using HTTPS
});
