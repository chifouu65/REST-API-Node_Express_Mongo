const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
    try {
        const TOKEN = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(TOKEN, process.env.TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};