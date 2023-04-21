const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../envconfig.js');
const User = require('../db/schemas/userSchema.js');

const isAccessTokenValid = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Access denied. Please provide a valid token.' });
    }

    try {
        const decodedToken = await jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decodedToken;
        next();
    } catch (err) {
        return res.status(403).json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const foundUser = await User.findOne({ userId: userId });
        if (!foundUser) {
            return res.status(401).json({ message: '인증 실패' });
        }
        return res.status(200).json({
            status: 200,
            payload: {
                userId: userId,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

module.exports = { isAccessTokenValid, authenticateUser };
