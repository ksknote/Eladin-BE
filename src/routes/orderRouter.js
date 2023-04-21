const { Router } = require('express');
const router = Router();

const orderService = require('../services/orderService');

// [사용자] 주문 추가
router.post('/', orderService.createOrder); // (주문 페이지)

// [관리자] 배송상태 수정
router.patch('/:orderInfo/delivery-status', orderService.updateDeliveryStatus); // (관리 페이지)

// [사용자] 주문정보 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
router.patch('/:orderInfo/delivery-info', orderService.updateDeliveryInfo);

// [사용자] 주문 완료 - 현재 주문내역 조회
router.get('/:orderInfo/complete-info', orderService.getCurrentOrder); // (주문완료 페이지)

// [사용자] 주문 조회 - 전체 주문내역 조회
router.get('/:userId/user', orderService.getOrdersByUserId); // (주문내역 페이지)

// [관리자] 주문 조회 - 전체 이용자 주문내역 조회
router.get('/', orderService.getAllOrders); // (관리 페이지)

// [사용자] 주문 취소 - 주문번호로 주문 취소
router.delete('/:orderInfo/user-cancel', orderService.cancelOrder); // (주문내역 페이지)

// [관리자] 주문 삭제 - 주문번호로 주문 삭제
router.delete('/:orderInfo/admin-delete', orderService.deleteOrder); // (관리 페이지)

module.exports = router;
