const { Router } = require('express');
const router = Router();

const { signUp, login, logout, me } = require('../services/userService');

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', me);

module.exports = router;
