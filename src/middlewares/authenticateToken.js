const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../envconfig.js');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Access denied. Please provide a valid token.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err) {
            return res
                .status(403)
                .json({ message: 'Invalid token. Please provide a valid token.' });
        }
        req.user = decodedToken;
        next();
    });
};

module.exports = authenticateToken;
