const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../envconfig.js');
const User = require('../db/schemas/userSchema.js');

const isAccessTokenValid = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const accessToken = authHeader && authHeader.split(' ')[1];
    // uuid는 쿠키에있을수도 body에 있을 수도 헤더에 있을 수도 있다.
    const uuid = req.cookies.uuid || req.body.uuid || req.headers['uuid'];

    if (req.method === 'GET' && !accessToken && !uuid) {
        // 그냥 방문자인 경우
        console.log('나 지금 방문자임');
        return next();
    }

    console.log('나 지금 회원임 (1) >> ', accessToken);
    console.log('나 지금 비회원임 (1) >> ', uuid);

    if (!accessToken && !uuid)
        // 토큰도 없고 uuid도 없으면, 내가 회원인데 토큰이 없는경우임 >> 에러
        return res.status(401).json({ message: 'Access denied. Please provide a valid token.' });

    if (accessToken && !uuid) {
        console.log('나 지금 회원임 (2) >> ', accessToken);
        // 회원 : 토큰은 있는데 uuid는 없음
        try {
            req.user = await jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
            next();
        } catch (err) {
            // access token 이 만료된 경우
            if (err.name === 'TokenExpiredError') {
                const refreshToken = req.cookies.refreshToken;

                if (!refreshToken)
                    return res
                        .status(401)
                        .json({ message: 'Access denied. Please provide a valid token' });
                try {
                    const decodedRefreshToken = await jwt.verify(
                        refreshToken,
                        REFRESH_TOKEN_SECRET
                    );
                    const accessToken = jwt.sign(
                        { userId: decodedRefreshToken.userId },
                        ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
                        }
                    );
                    res.json({ accessToken });
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
            return res
                .status(403)
                .json({ message: '토큰이 유효하지 않습니다. 토큰을 확인해주세요.' });
        }
    } else if (!accessToken && uuid) {
        // 비회원 : 토큰은 없는데 uuid는 있음
        console.log('나 지금 비회원임 (2) >> ', uuid);
        try {
            req.uuid = uuid;
            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: '서버 오류' });
        }
    }
};

module.exports = { isAccessTokenValid };
