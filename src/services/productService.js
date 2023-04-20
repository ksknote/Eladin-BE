const { Product } = require('../db/index');
const { AppError } = require('../middlewares/errorHandler');
// 관리자
const productService = {
    // 책 전체 조회
    async getAllProducts(req, res, next) {
        try {
            const foundAllProducts = await Product.find({});
            res.status(200).json({ message: '모든 책 조회 성공', data: foundAllProducts });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '모든 책 조회 실패'));
        }
    },

    // 특정 책 조회
    async getProduct(req, res, next) {
        try {
            const { productId } = req.params;

            const foundProduct = await Product.findOne({ productId });
            if (!foundProduct) {
                return next(new AppError(404, '책을 찾을 수 없습니다.'));
            }
            res.status(200).json({ message: '단일 책 조회 성공 ', data: foundProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '단일 책 조회 실패'));
        }
    },

    // [관리자 전용] 책 추가하기
    async createProduct(req, res, next) {
        try {
            const { productId, title, author, price, category, introduction } = req.body;
            const createInfo = { productId, title, author, price, category, introduction };

            const createdProduct = await Product.create(createInfo);
            res.status(201).json({ message: '책 추가 성공', data: createdProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 추가 실패'));
        }
    },

    // [관리자 전용] 책 정보 수정
    async updateProduct(req, res, next) {
        try {
            const { productId } = req.params;
            const { title, author, price, category, introduction } = req.body;
            const updateInfo = { title, author, price, category, introduction };

            const updatedProduct = await Product.updateOne({ productId }, updateInfo, {
                new: true,
            });
            if (updatedProduct.n === 0) {
                return next(new AppError(404, '책을 찾을 수 없습니다.'));
            }
            res.status(201).json({ message: '책 정보 수정 성공', data: updatedProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 정보 수정 실패'));
        }
    },

    // [관리자 전용] 책 정보 삭제
    async deleteProduct(req, res, next) {
        try {
            const { productId } = req.params;

            const foundProduct = await Product.findOne({ productId });
            if (!foundProduct) {
                return next(new AppError(404, '책을 찾을 수 없습니다.'));
            }
            await Product.deleteOne({ productId });

            res.status(201).json({ message: '책 정보 삭제 성공' });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 정보 삭제 실패'));
        }
    },
};

module.exports = productService;
