const { Router } = require('express');
const router = Router();
const { isAccessTokenValid } = require('../middlewares/jwt');

const {
    checkDuplicateUserId,
    checkDuplicateEmail,
    checkDuplicateUserName,
    signUp,
    logIn,
    logInNonMember,
    logOut,
    getUserInfo,
    updateUser,
} = require('../services/userService');

router.post('/signup', signUp);

// 최초 로그인 이후 모든 요청에 대해 토큰 유효성 검사를 진행한다.

router.post('/login', logIn);

// 비회원 로그인 uuid 발급
router.post('/loginNonMember', logInNonMember);

router.patch('/me', isAccessTokenValid, updateUser);

router.get('/users/:id', isAccessTokenValid, getUserInfo);

router.delete('/logout', logOut);

router.get('/check-userid/:userId', checkDuplicateUserId);

router.get('/check-email/:email', checkDuplicateEmail);

router.get('/check-username/:userName', checkDuplicateUserName);

module.exports = router;
