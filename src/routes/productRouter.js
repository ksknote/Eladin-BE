const { Router } = require('express');
const router = Router();

const productService = require('../services/productService');

// [사용자] 책 목록 - 전체 책 조회
router.get('/', productService.getAllProducts); // (메인 페이지)

// (카테고리별 책 조회 추가 ?)

// [사용자] 책 정보 상세 - 선택한 책 상세 정보 조회
router.get('/:productId', productService.getProduct); // (책 상세 페이지)

// [관리자] 책 정보 추가
router.post('/', productService.createProduct); // (관리 페이지)

// [관리자] 책 정보 수정
router.put('/:productId', productService.updateProduct); // (관리 페이지)

// [관리자] 책 삭제
router.delete('/:productId', productService.deleteProduct); // (관리 페이지)

module.exports = router;
