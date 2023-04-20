const { Router } = require('express');
const router = Router();

const productService = require('../services/productService');

router.get('/', productService.getAllProducts); // 책 전체 조회

router.get('/:productId', productService.getProduct); // 책 단일 조회

router.post('/', productService.createProduct); // [관리자 전용] 책 추가하기

router.put('/:productId', productService.updateProduct); // [관리자 전용] 책 정보 수정

router.delete('/:productId', productService.deleteProduct); // [관리자 전용] 책 정보 삭제

module.exports = router;

//postman 으로 입력했을 때 데이터 베이스로 들어오는지
