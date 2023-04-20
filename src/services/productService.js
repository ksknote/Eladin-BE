const { Product } = require('../db/index');

// 관리자
const productService = {
    // 책 전체 조회
    async getAllProducts(req, res) {
        try {
            const foundAllProducts = await Product.find({});

            res.status(201).json(foundAllProducts);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '책 조회 실패' });
        }
    },

    // 특정 책 조회
    async getProduct(req, res) {
        const { productId } = req.params;

        try {
            const foundProduct = await Product.findOne({ productId });

            res.status(201).json(foundProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '단일 책 조회 실패' });
        }
    },

    // [관리자 전용] 책 추가하기
    async createProduct(req, res) {
        const { productId, title, author, price, category, introduction } = req.body;
        const createInfo = { productId, title, author, price, category, introduction };

        try {
            await Product.create(createInfo);

            res.status(201).json({ message: '책 추가 성공' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '책 추가 실패' });
        }
    },

    // [관리자 전용] 책 정보 수정
    async updateProduct(req, res) {
        const { productId } = req.params;
        const { title, author, price, category, introduction } = req.body;
        const updateInfo = { title, author, price, category, introduction };

        try {
            const updatedProduct = await Product.updateOne({ productId }, updateInfo);

            res.status(201).json(updatedProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '책 정보 수정 실패' });
        }
    },

    // [관리자 전용] 책 정보 삭제
    async deleteProduct(req, res) {
        const { productId } = req.params;

        try {
            const foundProduct = await Product.findOne({ productId });
            if (!foundProduct) {
                throw new Error('삭제하실 책의 정보가 없습니다.');
            }
            await Product.deleteOne({ productId });

            res.status(201).json({ message: '책 정보 삭제 성공' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '책 정보 삭제 실패' });
        }
    },
};

module.exports = productService;
