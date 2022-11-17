const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const TOKEN = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(TOKEN, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};