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
    const { userId, password, email, userName } = req.body;
    if (!userId || !password || !email || !userName) {
        return next(new AppError(400, '모든사항을 입력해주세요.'));
    }
    // // 비밀번호 영문+숫자+특수문자 조합 8~15자리 유효성검사
    // const regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
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
            uuid: null,
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
    const { userId, password } = req.body;
    if (!userId) {
        return next(new AppError(400, '아이디를 입력해주세요.'));
    }
    if (!password) {
        return next(new AppError(400, '비밀번호를 입력해주세요.'));
    }
    try {
        const foundUser = await User.findOne({ userId });
        if (!foundUser) return next(new AppError(400, '존재하지 않는 아이디입니다.'));

        // const { userId, password, email, userName } = foundUser;

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return next(new AppError(400, '비밀번호가 일치하지 않습니다.'));

        const payload = {
            userId: foundUser.userId,
            password: foundUser.password,
            role: foundUser.role,
        };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        });

        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        });
        res.setHeader('Authorization', `Bearer ${accessToken}`);
        // 만약 HTTPS를 사용한다면, res.cookie() 메서드에 secure: true 옵션을 추가하여 쿠키가 HTTPS로만 전송되도록 설정 가능
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
        });
        res.status(200).json({
            message: '로그인 성공',
            data: {
                userId: foundUser.userId,
                email: foundUser.email,
                userName: foundUser.userName,
                role: foundUser.role,
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '로그인 실패'));
    }
};

const logInNonMember = async (req, res, next) => {
    try {
        const { email, password, userName } = req.body;

        if (!email || !password || !userName)
            return next(new AppError(400, '모든사항을 입력해주세요.'));

        const foundUser = await User.findOne({ email });

        if (foundUser) return next(new AppError(400, '이미 존재하는 이메일입니다'));

        const hashedPassword = await hashPassword(password);

        const NonMember = await User.create({
            password: hashedPassword,
            email,
            userName,
        });

        const foundNonMember = await User.findOne({ email });

        res.status(201).json({
            message: '비회원 로그인 성공',
            data: { uuid: foundNonMember.uuid },
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

const updateUser = async (req, res, next) => {
    const { password, email, userName } = req.body;
    const userId = req.user.userId;
    try {
        const foundUser = await User.findOne({ userId });

        if (!foundUser) return next(new AppError(400, '존재하지 않는 아이디입니다.'));

        const updateData = {};

        if (password) updateData.password = await bcrypt.hash(password, 10);

        if (email) updateData.email = email;

        if (userName) updateData.userName = userName;

        const updatedUser = await User.updateOne({ userId }, { $set: updateData }, { new: true });
        res.status(200).json({
            message: '회원정보 수정 성공',
            data: {
                userId: updatedUser.userId,
                email: updatedUser.email,
                userName: updatedUser.userName,
            },
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '회원정보 수정 실패'));
    }
};

const logOut = async (req, res, next) => {
    try {
        res.clearCookie('token.refreshToken');
        res.status(200).json({ message: '로그아웃 성공' });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '로그아웃 실패'));
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const { id } = req.params;
        const foundUser = await User.findOne({ userId: id });
        const { userId, email, userName } = foundUser;
        if (!foundUser) return next(new AppError(404, '사용자 정보를 찾을 수 없습니다'));

        const userInfo = {
            userId,
            email,
            userName,
        };
        res.status(200).json({ message: '사용자 정보 조회 성공', data: userInfo });
        console.log('사용자 정보 조회 성공');
    } catch (error) {
        console.error(error);
        next(new AppError(500, '사용자 정보 조회 실패'));
    }
};

module.exports = { signUp, logIn, logInNonMember, logOut, getUserInfo, updateUser };
