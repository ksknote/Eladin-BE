const { Product, User } = require('../db/models/index');
const { AppError } = require('../middlewares/errorHandler');

// [사용자] 카테고리 조회 - 카테고리 목록 조회
const getCategories = async (req, res, next) => {
    try {
        const foundCategories = await Product.distinct('category');

        if (!foundCategories) next(new AppError(400, '카테고리 목록이 존재하지 않습니다.'));

        res.status(200).json({ message: '카테고리 목록 조회 성공 ', data: foundCategories });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [관리자] 카테고리 추가 - 카테고리 추가
const createCategory = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        const addCategory = req.body.category;

        if (!addCategory) return next(new AppError(400, '등록하실 카테고리를 입력해주세요.'));

        const foundCategories = await Product.distinct('category');

        if (foundCategories.includes(addCategory)) {
            return next(new AppError(400, `등록하실 '${addCategory}' 카테고리는 이미 존재합니다.`));
        }

        const minProductId = await Product.find()
            .sort({ productId: 1 })
            .limit(1)
            .select('productId')
            .lean();

        const newProductId = minProductId.length ? minProductId[0].productId - 1 : 0;

        const createInfo = {
            productId: newProductId,
            title: '1',
            author: '1',
            price: 1,
            category: addCategory,
            introduction: '1',
            imgUrl: '1',
            bestSeller: false,
            newBook: false,
            recommend: false,
            publisher: '1',
        };

        const createdProduct = await Product.create(createInfo);
        res.status(201).json({ message: '카테고리 등록 성공 ', data: addCategory });
    } catch (error) {
        console.error(error);
        next(new AppError(500, { message: '서버 에러' }));
    }
};

// [관리자] 카테고리 수정 - 카테고리 수정 (해당하는 모든 책에 반영)
const updateCategory = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        const { currentCategory, updateCategory } = req.body;

        if (!currentCategory || !updateCategory)
            return next(
                new AppError(400, '현재 카테고리와, 수정하실 카테고리를 모두 입력해주세요.')
            );

        // 휴먼 에러는 에러처리 굳이 안해도 됨
        // if (currentCategory === updateCategory)
        //     return next(new AppError(400, '현재 카테고리와 수정하실 카테고리가 동일합니다.'));

        const updatedCategory = await Product.updateMany(
            { category: currentCategory },
            { category: updateCategory },
            { new: true }
        );

        res.status(200).json({ message: '카테고리 수정 성공', data: { updateCategory } });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [관리자] 카테고리 삭제 - 카테고리 삭제
const deleteCategory = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        const removeCategory = req.body.category;

        if (!removeCategory) return next(new AppError(400, '삭제하실 카테고리를 입력해주세요.'));

        const foundCategories = await Product.distinct('category');

        if (!foundCategories.includes(removeCategory))
            return next(
                new AppError(400, `삭제하실 '${removeCategory}' 카테고리가 존재하지 않습니다.`)
            );

        const deletedCategory = await Product.deleteMany({ category: removeCategory });

        res.status(200).json({
            message: '카테고리 삭제 성공 ',
            data: deletedCategory,
            removeCategory: removeCategory,
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [관리자] 상품 추가 - 책 정보 추가
const createProduct = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        // productId는 서버에서 새로 생성함
        const { title, author, price, category, introduction, imgUrl, publisher } = req.body;

        if (!title || !author || !price || !category || !introduction || !imgUrl || !publisher)
            return next(new AppError(400, '책 정보를 모두 입력해 주세요.'));

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
            bestSeller: Math.random() >= 0.5,
            newBook: Math.random() >= 0.5,
            recommend: Math.random() >= 0.5,
            publisher,
        };

        const createdProduct = await Product.create(createInfo);

        res.status(201).json({ message: '책 추가 성공', data: createdProduct });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [관리자] 상품 수정 - 책 정보 수정
const updateProduct = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        const { productId } = req.params;

        const { title, author, price, category, introduction, imgUrl, publisher } = req.body;

        if (!productId) return next(new AppError(400, 'productId를 입력해 주세요.'));

        if (!title || !author || !price || !category || !introduction || !imgUrl || !publisher)
            return next(new AppError(400, '책 정보를 모두 입력해 주세요.'));

        const foundProduct = await Product.findOne({ productId });

        if (!foundProduct) return next(new AppError(400, '수정하실 책이 존재하지 않습니다.'));

        const updateInfo = {
            title,
            author,
            price,
            category,
            introduction,
            imgUrl,
            bestSeller: Math.random() >= 0.5,
            newBook: Math.random() >= 0.5,
            recommend: Math.random() >= 0.5,
            publisher,
        };

        const updatedProduct = await Product.updateOne({ productId }, updateInfo, {
            new: true,
        });

        const foundUpdatedProduct = await Product.findOne({ productId });

        res.status(200).json({ message: '책 정보 수정 성공', data: foundUpdatedProduct });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [관리자] 상품 삭제 - 책 정보 삭제
const deleteProduct = async (req, res, next) => {
    if (req.user.role !== 'admin') return next(new AppError(403, '접근 권한이 없습니다.'));

    try {
        const { productId } = req.params;

        if (!productId) return next(new AppError(400, 'productId를 입력해 주세요.'));

        const foundProduct = await Product.findOne({ productId });

        if (!foundProduct) return next(new AppError(400, '삭제하실 책이 존재하지 않습니다.'));

        const deletedProduct = await Product.deleteOne({ productId });

        res.status(200).json({ message: '책 정보 삭제 성공', data: deletedProduct });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 목록 - 전체 책 조회
const getAllProducts = async (req, res, next) => {
    try {
        const foundAllProductsExceptEmpty = await Product.find({ productId: { $gt: 0 } });

        if (!foundAllProductsExceptEmpty)
            next(new AppError(400, 'DB에 책 데이터가 더이상 존재하지 않습니다.'));

        res.status(200).json({
            message: '모든 책 조회 성공',
            data: foundAllProductsExceptEmpty,
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 목록 - 카테고리별 책 목록 조회
const getProductsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        if (!category) return next(new AppError(400, '카테고리를 입력해 주세요.'));

        const foundCategories = await Product.distinct('category');

        if (!foundCategories.includes(category))
            return next(new AppError(400, `조회하실 '${category}' 카테고리는 존재하지 않습니다.`));

        const foundProduct = await Product.find({ category, productId: { $gt: 0 } });
        if (!foundProduct || foundProduct.length === 0)
            return next(new AppError(400, `'${category}' 카테고리 관련 책이 존재하지 않습니다.`));

        res.status(200).json({
            message: '카테고리별 책 목록 조회 성공',
            data: foundProduct,
        });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 목록 - 베스트셀러 목록 조회
const getProductsByBestSeller = async (req, res, next) => {
    try {
        const foundProducts = await Product.find({
            bestSeller: true,
            newBook: false,
            recommend: false,
        });

        if (!foundProducts) next(new AppError(400, '베스트셀러 목록이 존재하지 않습니다.'));

        res.status(200).json({ message: '베스트셀러 목록 조회 성공 ', data: foundProducts });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 목록 - 신간도서 책 목록 조회
const getProductsByNewBook = async (req, res, next) => {
    try {
        const foundProducts = await Product.find({
            bestSeller: false,
            newBook: true,
            recommend: false,
        });

        if (!foundProducts) next(new AppError(400, '신간도서 목록이 존재하지 않습니다.'));

        res.status(200).json({ message: '신간도서 목록 조회 성공 ', data: foundProducts });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 목록 - 추천도서 책 목록 조회
const getProductsByRecommended = async (req, res, next) => {
    try {
        const foundProducts = await Product.find({
            bestSeller: false,
            newBook: false,
            recommend: true,
        });

        if (!foundProducts) next(new AppError(400, '추천도서 목록이 존재하지 않습니다.'));

        res.status(200).json({ message: '추천도서 목록 조회 성공 ', data: foundProducts });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용자] 상품 상세 - 선택한 책의 상세정보 조회
const getProductByProductId = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!productId) return next(new AppError(400, 'productId를 입력해 주세요.'));

        const foundProduct = await Product.findOne({ productId });

        if (!foundProduct) return next(new AppError(400, '선택하신 책이 존재하지 않습니다.'));

        res.status(200).json({ message: '선택한 책 조회 성공 ', data: foundProduct });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

// [사용지] 상품 조회 - 검색어 관련 조회
const getSearchProducts = async (req, res, next) => {
    try {
        const query = req.query.q;

        if (!query) return next(new AppError(400, '검색어를 입력해 주세요.'));

        const foundBooks = await Product.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { publisher: { $regex: query, $options: 'i' } },
            ],
        });

        res.status(200).json({ message: '책 검색 성공', data: foundBooks });
    } catch (error) {
        console.error(error);
        next(new AppError(500, '서버 에러'));
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductsByCategory,
    getProductsByBestSeller,
    getProductsByNewBook,
    getProductsByRecommended,
    getProductByProductId,
    getSearchProducts,
};
