const { User } = require('../db/models/index');
const { AppError } = require('../middlewares/errorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    BCRYPT_SALT_ROUNDS,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
} = require('../envconfig.js');

const hashPassword = async (password) => {
    const saltRounds = parseInt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const signUp = async (req, res, next) => {
    if (req.method !== 'POST') {
        return next(new AppError(400, '잘못된 요청입니다.'));
    }
    const { userId, password, email, userName } = req.body;
    if (!userId || !password || !email || !userName) {
        return next(new AppError(400, '모든사항을 입력해주세요.'));
    }

    try {
        const foundUser = await User.findOne({ $or: [{ userId }, { email }, { userName }] });
        if (foundUser) {
            if (foundUser.userId === userId) {
                return next(new AppError(400, '이미 존재하는 아이디입니다'));
            } else if (foundUser.email === email) {
                return next(new AppError(400, '이미 존재하는 이메일입니다'));
            } else if (foundUser.userName === userName) {
                return next(new AppError(400, '이미 존재하는 유저네임입니다'));
            }
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            userId,
            password: hashedPassword,
            email,
            userName,
        });

        await newUser.save();

        res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '회원가입 실패'));
    }
};

const logIn = async (req, res, next) => {
    if (req.method !== 'POST') return next(new AppError(405, '잘못된 요청입니다.'));
    const { userId, password } = req.body;
    if (!userId) {
        return next(new AppError(400, '아이디를 입력해주세요.'));
    }
    if (!password) {
        return next(new AppError(400, '비밀번호를 입력해주세요.'));
    }
    try {
        const foundUser = await User.findOne({ userId });
        if (!foundUser) {
            return next(new AppError(400, '존재하지 않는 아이디입니다.'));
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return next(new AppError(400, '비밀번호가 일치하지 않습니다.'));
        }

        const accessToken = jwt.sign({ userId: foundUser.userId }, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });

        const refreshToken = jwt.sign({ userId: foundUser.userId }, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        });

        res.setHeader('Authorization', `Bearer ${accessToken}`);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });
        res.status(200).json({
            message: '로그인 성공',
            userId: foundUser.userId,
            email: foundUser.email,
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '로그인 실패'));
    }
};

const updateUser = async (req, res, next) => {
    if (req.method !== 'PATCH') {
        return next(new AppError(405, '잘못된 요청입니다.'));
    }

    const { password, email, userName } = req.body;
    const userId = req.user.userId;
    try {
        const foundUser = await User.findOne({ userId });

        if (!foundUser) {
            return next(new AppError(400, '존재하지 않는 아이디입니다.'));
        }

        const updateData = {};

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        if (email) {
            updateData.email = email;
        }

        if (userName) {
            updateData.userName = userName;
        }

        const updateUser = await User.updateOne({ userId }, { $set: updateData });
        res.status(200).json({
            message: '회원정보 수정 성공',
            data: updateUser,
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '회원정보 수정 실패'));
    }
};

const logOut = async (req, res, next) => {
    if (req.method !== 'DELETE') {
        return next(new AppError(405, '잘못된 요청입니다.'));
    }
    try {
        res.clearCookie('tokens.access_token');
        res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '로그아웃 실패'));
    }
};

const getUserInfo = async (req, res, next) => {
    if (req.method !== 'GET') {
        return next(new AppError(405, '잘못된 요청입니다.'));
    }
    try {
        const { userId } = req.body;
        const user = await User.findOne({ userId });
        if (!user) {
            return next(new AppError(404, '사용자 정보를 찾을 수 없습니다'));
        }
        const userInfo = {
            userId: user.userId,
            email: user.email,
            userName: user.userName,
        };
        res.status(200).json({ message: '사용자 정보 조회 성공', data: userInfo });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '사용자 정보 조회 실패'));
    }
};

module.exports = { signUp, logIn, logOut, getUserInfo, updateUser };
