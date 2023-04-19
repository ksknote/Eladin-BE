const { Router } = require('express');
const router = Router();
const authenticateToken = require('../middlewares/authenticateToken');

const { signUp, logIn, logout, me } = require('../services/userService');

router.post('/signup', signUp);

router.post('/login', authenticateToken, logIn);

// router.post('/logout', logout);

// router.get('/me', me);

module.exports = router;
