const { Router } = require('express');
const router = Router();

const productService = require('../services/productService');
const { isAccessTokenValid } = require('../middlewares/jwt');
// [사용자] 카테고리 조회 - 카테고리 목록 조회
router.get('/categories', isAccessTokenValid, productService.getCategories); // (카테고리 목록 페이지), (상품 관리 페이지)

// [관리자] 카테고리 추가 - 카테고리 등록
// 그냥 입력한 카테고리만 넣고 나머지 필드는 없이 만들고, 나머지 라우터에서 조회할때는 필드 있는거만 조회되게 하자
router.post('/categories/category', isAccessTokenValid, productService.createCategory);

// [관리자] 카테고리 수정 - 카테고리 수정 (해당하는 모든 책에 반영)
router.patch('/categories/category', isAccessTokenValid, productService.updateCategory); // (카테고리 관리 페이지)

// [관리자] 카테고리 삭제 - 카테고리 삭제
// 삭제되면 카테고리에 해당하는 책까지 다 삭제 해야함
router.delete('/categories/category', isAccessTokenValid, productService.deleteCategory);

// [관리자] 상품 추가 - 책 정보 등록
// productId는 서버에서 새로 생성함
// category는 카테고리 조회 라우터에서 카테고리 리스트 받아서 사용자 선택한 값 보내야함
router.post('/products', isAccessTokenValid, productService.createProduct); // (상품 관리 페이지)

// [관리자] 상품 수정 - 책 정보 수정
router.patch('/products/:productId', isAccessTokenValid, productService.updateProduct); // (상품 관리 페이지)

// [관리자] 상품 삭제 - 책 정보 삭제
router.delete('/products/:productId', isAccessTokenValid, productService.deleteProduct); // (상품 관리 페이지)

// [사용자] 상품 목록 - 전체 책 조회
router.get('/products', isAccessTokenValid, productService.getAllProducts); // (메인 페이지)

// [사용자] 상품 목록 - 카테고리별 책 목록 조회
router.get('/categories/:category', isAccessTokenValid, productService.getProductsByCategory); // (카테고리 관리 페이지)

// [사용자] 상품 목록 - 베스트셀러 책 목록 조회
router.get('/products/best-sellers', isAccessTokenValid, productService.getProductsByBestSeller);

// [사용자] 상품 목록 - 신간도서 책 목록 조회
router.get('/products/new-books', isAccessTokenValid, productService.getProductsByNewBook);

// [사용자] 상품 목록 - 추천도서 책 목록 조회
router.get(
    '/products/recommended-books',
    isAccessTokenValid,
    productService.getProductsByRecommended
);

// [사용자] 상품 상세 - 선택한 책의 상세정보 조회
router.get('/products/:productId', isAccessTokenValid, productService.getProductByProductId); // (책 상세 페이지)

//[사용자] 상품 조회 - 검색어 관련 조회
router.get('/search', isAccessTokenValid, productService.getSearchProducts);

module.exports = router;
