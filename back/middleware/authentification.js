const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @description Middleware to check if the user
 * is authenticated before allowing access to the routes
 * width token verification
 * @param req // req (token) from the client
 * @param res // res (error message) to the client
 * @param next // next (function) to the next middleware
 * @Token verification process:
 * 1. Extract the token from the request header
 * 2. Verify the token
 * 3. If the token is valid, the user is authenticated
 * 4. If the token is invalid, the user is not authenticated
 * 5. If the token is missing, the user is not authenticated
 */
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
