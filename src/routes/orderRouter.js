const { Router } = require('express');
const router = Router();
const { isAccessTokenValid } = require('../middlewares/jwt');

const {
    createOrder,
    createOrderForNonMember,
    updateDeliveryStatus,
    updateDeliveryInfo,
    getMyAllOrders,
    getMyAllOrdersForNonMember,
    getAllOrders,
    cancelOrder,
    deleteOrder,
    getCurrentOrder,
} = require('../services/orderService');

// [사용자] 주문 등록 ( 회원,비회원 카테고리 페이지 or 장바구니에서 바로구매 눌렀을 때 )
router.post('/user', isAccessTokenValid, createOrder); // (주문 페이지)

// [비회원] 주문 등록
router.post('/nonmember', isAccessTokenValid, createOrderForNonMember);

// [관리자] 주문 수정 - 배송상태 수정
router.patch('/admin', isAccessTokenValid, updateDeliveryStatus); // (관리 페이지)

// [사용자] 주문 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
router.patch('/user', isAccessTokenValid, updateDeliveryInfo); // (주문내역 수정 페이지)

// [사용자] 주문 조회 - 개인 주문내역 조회
router.get('/user/:userId', isAccessTokenValid, getMyAllOrders); // (주문내역 페이지)

// [비회원] 주문 조회 - 개인 주문내역 조회
router.get('/nonmember/:uuid', isAccessTokenValid, getMyAllOrdersForNonMember);

// [관리자] 주문 조회 - 전체 주문내역 조회
router.get('/admin', isAccessTokenValid, getAllOrders); // (관리 페이지)

// [사용자] 주문 취소 - 사용자 주문 취소
router.delete('/user', isAccessTokenValid, cancelOrder); // (주문내역 페이지)

// [관리자] 주문 삭제 - 관리자 주문 삭제
router.delete('/admin', isAccessTokenValid, deleteOrder); // (관리 페이지)

// [사용자/비회원] 주문 완료 - 현재 주문내역 조회(주문이 완료되었습니다.)
router.get('/:orderNumber', isAccessTokenValid, getCurrentOrder); // (주문완료 페이지)

module.exports = router;
