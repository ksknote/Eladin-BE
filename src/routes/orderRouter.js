const { Router } = require('express');
const router = Router();

const orderService = require('../services/orderService');
const { isAccessTokenValid } = require('../middlewares/jwt');
// [사용자] 주문 추가 ( 회원,비회원 카테고리 페이지 or 장바구니에서 바로구매 눌렀을 때 )
router.post('/', orderService.createOrder); // (주문 페이지)

// [관리자] 주문 수정 - 배송상태 수정
router.patch(
    '/:orderNumber/delivery-status',
    isAccessTokenValid,
    orderService.updateDeliveryStatus
); // (관리 페이지)

// [사용자] 주문 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
router.patch('/:orderNumber/delivery-info', isAccessTokenValid, orderService.updateDeliveryInfo); // (주문내역 수정 페이지)

// [사용자] 주문 완료 - 현재 주문내역 조회
router.get('/:orderNumber/current-order', isAccessTokenValid, orderService.getCurrentOrder); // (주문완료 페이지)

// [사용자] 주문 조회 - 개인 주문내역 조회
router.get('/:userId/user', isAccessTokenValid, orderService.getOrdersByUserId); // (주문내역 페이지)

// [관리자] 주문 조회 - 전체 주문내역 조회
router.get('/', isAccessTokenValid, orderService.getAllOrders); // (관리 페이지)

// [사용자] 주문 취소 - 사용자 주문 취소
router.delete('/:orderNumber/user-cancel', isAccessTokenValid, orderService.cancelOrder); // (주문내역 페이지)

// [관리자] 주문 삭제 - 관리자 주문 삭제
router.delete('/:orderNumber/admin-delete', isAccessTokenValid, orderService.deleteOrder); // (관리 페이지)

module.exports = router;
