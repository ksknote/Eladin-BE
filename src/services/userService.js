const { User } = require('../db/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, BCRYPT_SALT_ROUNDS, expiresInSec } = require('../envconfig.js');

const hashPassword = async (password) => {
    const saltRounds = parseInt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

const signUp = async (req, res) => {
    const { userId, password, email, userName } = req.body;
    if (!userId || !password || !email || !userName) {
        return res.status(400).json({ message: '모든사항을 입력해주세요.' });
    }
    try {
        const foundUser = await User.findOne({ userId });
        if (foundUser) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다' });
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            userId,
            password: hashedPassword,
            email,
            userName,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser.userId }, JWT_SECRET, {
            expiresIn: expiresInSec,
        });

        res.status(201).json({ message: '회원가입 성공', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '회원가입 실패' });
    }
};

const logIn = async (req, res) => {
    const { userId, password } = req.body;
    if (!userId) {
        return res.status(400).json({ message: '아이디를 입력해주세요.' });
    }
    if (!password) {
        return res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    }
    try {
        const { userId, password } = req.body;
        const foundUser = await User.findOne({ userId });
        if (!foundUser) {
            return res.status(400).json({ message: '존재하지 않는 아이디입니다.' });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
        }
        res.status(200).json({ message: '로그인 성공' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '로그인 실패' });
    }
};

module.exports = { signUp, logIn };
