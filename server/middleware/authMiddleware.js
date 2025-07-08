module.exports = (req, res, next) => {
    if (req.session.user) {
        next(); // Continue
    } else {
        res.status(401).send('Unauthorized');
    }
};
