const { Router } = require('express');
const router = Router();

const productService = require('../services/productService');

// 필드 추가하기

// [사용자] 카테고리 조회 - 카테고리 목록 조회
router.get('/categories', productService.getCategoryList); // (카테고리 목록 페이지)

// [관리자] 카테고리 추가 - 카테고리 추가 >>> 그냥 입력한 카테고리만 넣고 나머지 필드는 없이 만들자
// router.post('admin/category');

// [관리자] 카테고리 수정 - 카테고리 수정 (해당하는 모든 책에 반영)
router.patch('/admin/category', productService.updateCategory); // (카테고리 관리 페이지)

// [관리자] 카테고리 삭제 - 카테고리 삭제 >>> 삭제되면 카테고리에 해당하는 책까지 다 삭제 해야함
// router.delete('admin/category');

// [관리자] 상품 추가 - 책 정보 추가 (productId는 서버에서 새로 생성함)
router.post('/admin', productService.createProduct); // (상품 관리 페이지)

// [관리자] 상품 수정 - 책 정보 수정
router.patch('/admin/:productId', productService.updateProduct); // (상품 관리 페이지)

// [관리자] 상품 삭제 - 책 정보 삭제
router.delete('/admin/:productId', productService.deleteProduct); // (상품 관리 페이지)

// [사용자] 상품 목록 - 전체 책 조회
router.get('/', productService.getAllProducts); // (메인 페이지)

// [사용자] 상품 목록 - 카테고리별 책 목록 조회
router.get('/categories/:category', productService.getProductByCategory); // (카테고리 관리 페이지)

// [사용자] 상품 상세 - 선택한 책의 상세정보 조회
router.get('/:productId', productService.getProductByProductId); // (책 상세 페이지)

module.exports = router;
