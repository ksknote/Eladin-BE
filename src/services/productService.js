const { Product } = require('../db/models/index');
const { AppError } = require('../middlewares/errorHandler');

const productService = {
    // [사용자] 카테고리 조회 - 카테고리 목록 조회
    async getCategoryList(req, res, next) {
        try {
            const foundCategories = await Product.distinct('category');

            if (!foundCategories) next(new AppError(404, '카테고리 목록을 찾을 수 없습니다.'));

            res.status(200).json({ message: '카테고리 목록 조회 성공 ', data: foundCategories });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '카테고리 목록 조회 실패'));
        }
    },

    // [관리자] 카테고리 추가 - 카테고리 추가

    // [관리자] 카테고리 수정 - 카테고리 수정 (해당하는 모든 책에 반영)
    async updateCategory(req, res, next) {
        try {
            const { currentCategory, updateCategory } = req.body;

            const updatedCategory = await Product.updateMany(
                { category: currentCategory },
                { category: updateCategory },
                { new: true }
            );

            if (updatedCategory.nModified === 0)
                return next(new AppError(404, '수정하신 카테고리는 기존과 동일합니다.'));

            res.status(201).json({ message: '카테고리 수정 성공', data: { updateCategory } });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '카테고리 수정 실패'));
        }
    },

    // [관리자] 카테고리 삭제 - 카테고리 삭제 >>> 프론트?

    // [관리자] 상품 추가 - 책 정보 추가
    async createProduct(req, res, next) {
        try {
            // productId는 서버에서 새로 생성함
            const {
                title,
                author,
                price,
                category,
                introduction,
                imgUrl,
                bestSeller,
                newBook,
                recommend,
                publisher,
            } = req.body;

            if (
                !title ||
                !author ||
                !price ||
                !category ||
                !introduction ||
                !imgUrl ||
                !bestSeller ||
                !newBook ||
                !recommend ||
                !publisher
            )
                return next(new AppError(404, '책 정보를 모두 입력해 주세요.'));

            if (isNaN(price))
                return next(new AppError(404, `입력하신 '${price}'은(는) 숫자 형식 이어야 합니다`));

            const maxProductId = await Product.find()
                .sort({ productId: -1 })
                .limit(1)
                .select('productId')
                .lean();

            const newProductId = maxProductId.length > 0 ? maxProductId[0].productId + 1 : 1;

            const createInfo = {
                productId: newProductId,
                title,
                author,
                price,
                category,
                introduction,
                imgUrl,
                bestSeller,
                newBook,
                recommend,
                publisher,
            };

            const createdProduct = await Product.create(createInfo);

            res.status(201).json({ message: '책 추가 성공', data: createdProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 추가 실패'));
        }
    },

    // [관리자] 상품 수정 - 책 정보 수정
    async updateProduct(req, res, next) {
        try {
            const { productId } = req.params;
            const {
                title,
                author,
                price,
                category,
                introduction,
                imgUrl,
                bestSeller,
                newBook,
                recommend,
                publisher,
            } = req.body;

            if (isNaN(productId))
                return next(
                    new AppError(404, `입력하신 '${productId}'은(는) 숫자 형식 이어야 합니다`)
                );

            const updateInfo = {
                title,
                author,
                price,
                category,
                introduction,
                imgUrl,
                bestSeller,
                newBook,
                recommend,
                publisher,
            };

            const updatedProduct = await Product.updateOne({ productId }, updateInfo, {
                new: true,
            });

            const foundUpdatedProduct = await Product.findOne({ productId });

            res.status(201).json({ message: '책 정보 수정 성공', data: foundUpdatedProduct }); // 수정된 내용 전체 보내줌
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 정보 수정 실패'));
        }
    },

    // [관리자] 상품 삭제 - 책 정보 삭제
    async deleteProduct(req, res, next) {
        try {
            const { productId } = req.params;

            if (isNaN(productId))
                return next(
                    new AppError(404, `입력하신 '${productId}'은(는) 숫자 형식 이어야 합니다`)
                );

            const foundProduct = await Product.findOne({ productId });

            if (!foundProduct) return next(new AppError(404, '삭제하실 책을 찾을 수 없습니다.'));

            const deletedProduct = await Product.deleteOne({ productId });

            res.status(201).json({ message: '책 정보 삭제 성공', data: deletedProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '책 정보 삭제 실패'));
        }
    },

    // [사용자] 상품 목록 - 전체 책 조회
    async getAllProducts(req, res, next) {
        try {
            const foundAllProducts = await Product.find({});

            res.status(200).json({ message: '모든 책 조회 성공', data: foundAllProducts });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '모든 책 조회 실패'));
        }
    },

    // [사용자] 상품 목록 - 카테고리별 책 목록 조회
    async getProductByCategory(req, res, next) {
        try {
            const { category } = req.params;

            const foundProduct = await Product.find({ category });

            if (!foundProduct || foundProduct.length === 0)
                return next(
                    new AppError(404, `'${category}' 카테고리 관련 책을 찾을 수 없습니다.`)
                );

            res.status(200).json({ message: '카테고리 관련 책 조회 성공 ', data: foundProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '카테고리 관련 책 조회 실패'));
        }
    },

    // [사용자] 상품 상세 - 선택한 책의 상세정보 조회
    async getProductByProductId(req, res, next) {
        try {
            const { productId } = req.params;

            if (isNaN(productId))
                return next(
                    new AppError(404, `입력하신 '${productId}'은(는) 숫자 형식 이어야 합니다`)
                );

            const foundProduct = await Product.findOne({ productId });

            if (!foundProduct) return next(new AppError(404, '선택한 책을 찾을 수 없습니다.'));

            res.status(200).json({ message: '선택한 책 조회 성공 ', data: foundProduct });
        } catch (error) {
            console.error(error);
            next(new AppError(500, '선택한 책 조회 실패'));
        }
    },
};

module.exports = productService;
