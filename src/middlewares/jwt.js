const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../envconfig.js');
const User = require('../db/schemas/userSchema.js');

const isAccessTokenValid = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (accessToken == null) {
        return res.status(401).json({ message: 'Access denied. Please provide a valid token.' });
    }

    try {
        const decodedToken = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
        // console.log('@@@@@@@@@@@@@@', decodedToken);
        req.user = decodedToken;
        // console.log('@@@@@@@@', req.user);
        next();
    } catch (err) {
        // access token 이 만료된 경우
        if (err.name === 'TokenExpiredError') {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken == null) {
                return res
                    .status(401)
                    .json({ message: 'Access denied. Please provide a valid token.' });
            }

            try {
                const decodedRefreshToken = await jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

                const newAccessToken = jwt.sign(
                    { userId: decodedRefreshToken.userId },
                    ACCESS_TOKEN_SECRET,
                    {
                        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
                    }
                );

                res.setHeader('accessToken', newAccessToken);
                next();
            } catch (err) {
                // refresh token 이 만료된 경우
                if (err.name === 'TokenExpiredError') {
                    res.clearCookie('refreshToken');
                    return res
                        .status(401)
                        .json({ message: 'Refresh token expired. Please login again.' });
                }
                return res
                    .status(403)
                    .json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
            }
        }
        // access token 이 유효하지 않은 경우
        return res.status(403).json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
    }
};

const authenticateUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const foundUser = await User.findOne({ userId: userId });
        if (!foundUser) {
            return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        return res.status(200).json({
            message: '사용자 인증 성공',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
};

module.exports = { isAccessTokenValid, authenticateUser };
