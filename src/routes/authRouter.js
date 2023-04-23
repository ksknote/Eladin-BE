const { Router } = require('express');
const router = Router();
const { isAccessTokenValid, authenticateUser } = require('../middlewares/jwt');

const { signUp, logIn, logOut, getUserInfo, updateUser } = require('../services/userService');

router.post('/signup', signUp);

// 최초로그인 이후부터 jwt토큰 검증 미들웨어를가 작동되어야 함.

router.post('/login', logIn);

// 토큰 유효성 검사를 위한 엔드포인트
router.get('/token', isAccessTokenValid);

// 사용자 인증 및 자동 로그인 처리를 위한 엔드포인트
router.get('/authentication', authenticateUser);

router.patch('/me', isAccessTokenValid, updateUser);

router.get('/users/:id', isAccessTokenValid, getUserInfo);

router.delete('/logout', logOut);

module.exports = router;

// - 로그인 - db에 저장된 정보로 로그인 성공 시, JWT 토큰이 프론트 단(sessionStorage, localStorage 등)에 저장되고, 다른 페이지(랜딩페이지, 상품페이지 등)로 이동한다.
// - 로그아웃 - 로그아웃 시, 프론트 단에 저장되어 있던 JWT토큰이 제거된다.
// - 사용자 정보 조회 - 사용자는 개인 페이지에서 자신의 회원 정보를 조회할 수 있다.
// - 사용자 정보 수정 -  사용자는 개인 페이지에서 자신의 회원 정보를 수정할 수 있다.
// - 사용자 정보 삭제 -  사용자는 개인 페이지에서 자신의 회원 정보를 삭제(탈퇴)할 수 있다.
// - 관리자 기능 - 관리자 계정이 존재하며, 일반 사용자 계정과 구분된다. adminRouter 만들기
// - 사용자 정보 - db에 사용자의 이메일, 이름, 비밀번호(해쉬화된 문자열), 주소를 저장할 수 있다.
