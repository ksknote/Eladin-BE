const { Router } = require('express');
const router = Router();

const orderService = require('../services/orderService');

// [사용자] 주문 추가
router.post('/', orderService.createOrder); // (주문 페이지)

// [관리자] 배송상태 수정
router.patch('/:orderNumber/delivery-status', orderService.updateDeliveryStatus); // (관리 페이지)

// [사용자] 주문정보 수정 - 배송 시작 전까지 주문 내역, 배송지정보 수정
router.patch('/:orderNumber/delivery-info', orderService.updateDeliveryInfo); // (주문내역 수정 페이지)

// [사용자] 주문 완료 - 현재 주문내역 조회
router.get('/:orderNumber/current-order', orderService.getCurrentOrder); // (주문완료 페이지)

// [사용자] 주문 조회 - 개인 주문내역 조회
router.get('/:userId/user', orderService.getOrdersByUserId); // (주문내역 페이지)

// [관리자] 주문 조회 - 전체 주문내역 조회
router.get('/', orderService.getAllOrders); // (관리 페이지)

// [사용자] 주문 취소 - 사용자 주문 취소
router.delete('/:orderNumber/user-cancel', orderService.cancelOrder); // (주문내역 페이지)

// [관리자] 주문 삭제 - 관리자 주문 삭제
router.delete('/:orderNumber/admin-delete', orderService.deleteOrder); // (관리 페이지)

module.exports = router;
