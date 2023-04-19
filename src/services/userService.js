const User = require('../db/models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, BCRYPT_SALT_ROUNDS, expiresInSec } = require('../envconfig.js');

const hashPassword = async (password) => {
    const password = user.password;
    const saltRounds = BCRYPT_SALT_ROUNDS;
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

        const hashedPassword = await hashPassword(user.password);
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
