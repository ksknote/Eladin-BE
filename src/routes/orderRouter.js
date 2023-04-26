const { Router } = require('express');
const router = Router();

const orderService = require('../services/orderService');
const { isAccessTokenValid } = require('../middlewares/jwt');

// [사용자] 주문 등록 ( 회원,비회원 카테고리 페이지 or 장바구니에서 바로구매 눌렀을 때 )
router.post('/user', isAccessTokenValid, orderService.createOrder); // (주문 페이지)

// [비회원] 주문 등록
router.post('/nonmember', isAccessTokenValid, orderService.createOrderForNonMember);

// [관리자] 주문 수정 - 배송상태 수정
router.patch('/admin', isAccessTokenValid, orderService.updateDeliveryStatus); // (관리 페이지)

// [사용자] 주문 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
router.patch('/user', isAccessTokenValid, orderService.updateDeliveryInfo); // (주문내역 수정 페이지)

// [사용자/비회원] 주문 완료 - 현재 주문내역 조회
router.get('/user/:orderNumber', isAccessTokenValid, orderService.getCurrentOrder); // (주문완료 페이지)

// [사용자] 주문 조회 - 개인 주문내역 조회
router.get('/user/:userId', isAccessTokenValid, orderService.getMyAllOrders); // (주문내역 페이지)

// [비회원] 주문 조회 - 개인 주문내역 조회
router.get('/nonmember/:uuid', isAccessTokenValid, orderService.getMyAllOrdersForNonMember);

// [관리자] 주문 조회 - 전체 주문내역 조회
router.get('/admin', isAccessTokenValid, orderService.getAllOrders); // (관리 페이지)

// [사용자] 주문 취소 - 사용자 주문 취소
router.delete('/user', isAccessTokenValid, orderService.cancelOrder); // (주문내역 페이지)

// [관리자] 주문 삭제 - 관리자 주문 삭제
router.delete('/admin', isAccessTokenValid, orderService.deleteOrder); // (관리 페이지)

module.exports = router;
