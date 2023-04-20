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
                .json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
        }
        req.user = decodedToken;
        next();
    });
};

module.exports = authenticateToken;
