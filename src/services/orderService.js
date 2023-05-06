const { Order } = require('../db/models/index');
const { Product } = require('../db/models/index');
const { User } = require('../db/models/index');
const { AppError } = require('../middlewares/errorHandler');
const bcrypt = require('bcrypt');
const { index } = require('../db/schemas/userSchema');
const { ObjectId } = require('mongoose');

// [사용자] 주문 추가 - 추가할 때 마다 새로운 주문번호 생성
const createOrder = async (req, res, next) => {
    try {
        const { userId, items, deliveryInfo } = req.body;

        if (!userId || !items || !deliveryInfo)
            return next(new AppError(400, '주문정보를 모두 입력해 주세요.'));

        const foundUser = await User.findOne({ userId });
        if (!foundUser) return next(new AppError(400, '존재하지 않는 사용자 입니다'));

        const orderNumber =
            Date.now().toString().slice(-9) +
            Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, '0');
        const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const createInfo = {
            userId,
            items,
            deliveryInfo,
            orderInfo: {
                orderNumber,
                totalPrice,
            },
        };

        const createdOrder = await Order.create(createInfo);

        res.status(201).json({ message: '주문 추가 성공', data: createdOrder });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[주문 등록] 서버 에러'));
    }
};

// [비회원] 주문 등록 - 추가할 때 마다 새로운 주문번호 생성
const createOrderForNonMember = async (req, res, next) => {
    try {
        const { uuid, items, deliveryInfo } = req.body;

        if (!uuid || !items || !deliveryInfo)
            return next(new AppError(400, '주문정보를 모두 입력해 주세요.'));

        const foundUser = await User.findOne({ uuid });
        if (!foundUser) return next(new AppError(400, '존재하지 않는 비회원 사용자 입니다'));

        const orderNumber =
            Date.now().toString().slice(-9) +
            Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, '0');
        const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        const createInfo = {
            uuid,
            items,
            deliveryInfo,
            orderInfo: {
                orderNumber,
                totalPrice,
            },
        };

        const createdOrder = await Order.create(createInfo);

        res.status(201).json({
            message: '비회원 주문 추가 성공',
            data: createdOrder,
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[비회원 주문 등록] 서버 에러'));
    }
};

// [관리자] 주문 수정 - 배송상태 수정
const updateDeliveryStatus = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    try {
        const { orderNumber, deliveryStatus } = req.body;

        if (!orderNumber || !deliveryStatus)
            return next(new AppError(400, '주문번호와 배송상태 정보를 모두 입력해 주세요.'));

        const updatedOrder = await Order.updateOne(
            { 'orderInfo.orderNumber': orderNumber },
            { deliveryStatus },
            { new: true }
        );

        const foundUpdatedOrder = await Order.findOne({ 'orderInfo.orderNumber': orderNumber });

        res.status(200).json({ message: '배송상태 수정 성공', data: foundUpdatedOrder });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[관리자 주문 수정] 서버 에러'));
    }
};

// [사용자] 주문 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
const updateDeliveryInfo = async (req, res, next) => {
    try {
        const { orderNumber, items, deliveryInfo, deliveryStatus } = req.body;

        if (!orderNumber || !items || !deliveryInfo || !deliveryStatus)
            return next(new AppError(400, '수정 정보를 모두 입력해 주세요.'));

        const newOrderNumber =
            Date.now().toString().slice(-9) +
            Math.floor(Math.random() * 1000)
                .toString()
                .padStart(3, '0');
        const newTotalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

        if (deliveryStatus === '배송 준비 중' || deliveryStatus === '배송 완료^^') {
            const updatedOrder = await Order.updateOne(
                { 'orderInfo.orderNumber': orderNumber },
                {
                    items, // 주문한 책 정보 수정
                    deliveryInfo, // 배송지 정보 수정
                    orderInfo: {
                        orderNumber: newOrderNumber,
                        totalPrice: newTotalPrice,
                    },
                },
                { new: true }
            );

            const foundUpdatedOrder = await Order.findOne({
                'orderInfo.orderNumber': newOrderNumber,
            });

            if (!foundUpdatedOrder)
                return next(
                    new AppError(400, '주문번호가 변경되었거나, 관리자에 의해 삭제된 주문입니다.')
                );

            res.status(200).json({ message: '주문정보 수정 성공', data: foundUpdatedOrder });
        }
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[사용자 주문 수정] 서버 에러'));
    }
};

// [사용자] 주문 완료 - 현재 주문내역 조회
const getCurrentOrder = async (req, res, next) => {
    try {
        const { orderNumber } = req.params;

        if (!orderNumber) return next(new AppError(400, '주문번호를 입력해 주세요.'));

        const foundOrder = await Order.findOne({ 'orderInfo.orderNumber': orderNumber });

        if (!foundOrder) return next(new AppError(400, '현재 주문내역이 존재하지 않습니다.'));

        const productIds = foundOrder.items.map((item) => item.productId);
        const products = await Product.find({ productId: { $in: productIds } }, { title: 1 });
        const titles = products.map((product) => product.title);

        res.status(200).json({
            message: '현재 주문내역 조회 성공',
            data: { foundOrder, titles },
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[현재 주문내역 조회] 서버 에러'));
    }
};

// [사용자] 주문 조회 - 개인 주문내역 조회
const getMyAllOrders = async (req, res, next) => {
    try {
        const { userId } = req.params;

        if (!userId) return next(new AppError(400, '유저아이디를 입력해 주세요.'));

        const foundOrders = await Order.find({ userId });

        if (!foundOrders) return next(new AppError(400, '개인 주문내역이 존재하지 않습니다.'));

        const titleList = [],
            imgUrlList = [];

        for (let order of foundOrders) {
            const productIds = order.items.map((item) => item.productId);
            const products = await Product.find(
                { productId: { $in: productIds } },
                { title: 1, imgUrl: 1 }
            );
            const titles = products.map((product) => product.title);
            const imgUrls = products.map((product) => product.imgUrl);

            titleList.push(titles);
            imgUrlList.push(imgUrls);
        }

        res.status(200).json({
            message: '개인 주문내역 조회 성공',
            data: { foundOrders, titleList, imgUrlList },
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[개인 주문내역 조회] 서버 에러'));
    }
};

// [비회원] 주문 조회 - 개인 주문내역 조회
const getMyAllOrdersForNonMember = async (req, res, next) => {
    try {
        const { uuid } = req.params;

        if (!uuid) return next(new AppError(400, 'uuid를 입력해 주세요'));

        const foundOrders = await Order.find({ uuid });

        if (!foundOrders)
            return next(new AppError(400, '비회원 개인 주문내역이 존재하지 않습니다.'));

        const titleList = [],
            imgUrlList = [];

        for (let order of foundOrders) {
            const productIds = order.items.map((item) => item.productId);
            const products = await Product.find(
                { productId: { $in: productIds } },
                { title: 1, imgUrl: 1 }
            );
            const titles = products.map((product) => product.title);
            const imgUrls = products.map((product) => product.imgUrl);

            titleList.push(titles);
            imgUrlList.push(imgUrls);
        }

        res.status(200).json({
            message: '비회원 개인 주문내역 조회 성공',
            data: { foundOrders, titleList, imgUrlList },
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[개인 주문내역 조회] 서버 에러'));
    }
};

// [비회원] 주문 조회 - 메이페이지에서 개인 주문내역 조회
const getMyAllOrdersForGuest = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return next(new AppError(400, '모든 정보를 입력해 주세요.'));

        const foundUser = await User.findOne({ email });
        if (!foundUser) return next(new AppError(400, '존재하지 않는 이메일입니다.'));

        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) return next(new AppError(400, '비밀번호가 일치하지 않습니다.'));

        const foundUUID = foundUser.uuid;

        const foundOrders = await Order.find({ uuid: foundUUID });

        if (!foundOrders)
            return next(new AppError(400, '비회원 개인 주문내역이 존재하지 않습니다.'));

        const titleList = [],
            imgUrlList = [];

        for (let order of foundOrders) {
            const productIds = order.items.map((item) => item.productId);
            const products = await Product.find(
                { productId: { $in: productIds } },
                { title: 1, imgUrl: 1 }
            );
            const titles = products.map((product) => product.title);
            const imgUrls = products.map((product) => product.imgUrl);

            titleList.push(titles);
            imgUrlList.push(imgUrls);
        }

        res.status(200).json({
            message: '비회원 개인 주문내역 조회 성공',
            data: { foundOrders, titleList, imgUrlList, userName: foundUser.userName },
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[개인 주문내역 조회] 서버 에러'));
    }
};

// [관리자] 주문 조회 - 전체 주문내역 조회
const getAllOrders = async (req, res, next) => {
    console.log('전체주문내역 조회 요청들어옴');
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    try {
        const foundAllOrders = await Order.find({});
        if (!foundAllOrders) return next(new AppError(400, '전체 주문내역이 존재하지 않습니다.'));

        const titleList = [];
        for (let order of foundAllOrders) {
            const productIds = order.items.map((item) => item.productId);
            const products = await Product.find({ productId: { $in: productIds } }, { title: 1 });
            const titles = products.map((product) => product.title);

            titleList.push(titles);
        }

        const userNameList = await Promise.all(
            foundAllOrders.map(async (order) => {
                let foundUserName;
                if (order.userId) {
                    foundUserName = await User.findOne({ userId: order.userId });
                } else if (order.uuid) {
                    foundUserName = await User.findOne({ uuid: order.uuid });
                }
                return foundUserName ? foundUserName.userName : 'N/A';
            })
        );

        res.status(200).json({
            message: '관리자 전체 주문내역 조회 성공',
            data: { foundAllOrders, titleList, userNameList },
        });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[전체 주문내역 조회] 서버 에러'));
    }
};

// [사용자] 주문 취소 - 사용자 주문 취소
const cancelOrder = async (req, res, next) => {
    try {
        const { orderNumber } = req.body;

        if (!orderNumber) return next(new AppError(400, '주문번호를 입력해 주세요.'));

        const foundOrder = await Order.findOne({ 'orderInfo.orderNumber': orderNumber });

        if (!foundOrder)
            return next(
                new AppError(400, '주문번호가 변경되었거나, 관리자에 의해 삭제된 주문입니다.')
            );

        if (
            foundOrder.deliveryStatus !== '배송 준비 중' ||
            foundOrder.deliveryStatus === '배송 완료^^'
        )
            return next(new AppError(400, '배송이 시작되어 취소하실 수 없습니다.'));

        const canceledOrder = await foundOrder.deleteOne({
            'orderInfo.orderNumber': orderNumber,
        });

        res.status(200).json({ message: '주문 취소 성공', data: canceledOrder });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[사용자 주문 취소]서버 에러'));
    }
};

// [관리자] 주문 삭제 - 관리자 주문 삭제
const deleteOrder = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: '접근 권한이 없습니다.' });
    }
    try {
        const { orderNumber } = req.body;

        if (!orderNumber) return next(new AppError(400, '주문번호를 입력해 주세요.'));

        const foundDeletedOrder = await Order.findOne({
            'orderInfo.orderNumber': orderNumber,
        });

        if (!foundDeletedOrder)
            return next(
                new AppError(400, '주문번호가 변경되었거나, 사용자가 이미 취소한 주문입니다.')
            );

        const deletedOrder = await Order.deleteOne({ 'orderInfo.orderNumber': orderNumber });

        res.status(200).json({ message: '주문 삭제 성공', data: foundDeletedOrder });
    } catch (error) {
        console.log(error);
        next(new AppError(500, '[관리자 주문 삭제] 서버 에러'));
    }
};

module.exports = {
    createOrder,
    createOrderForNonMember,
    updateDeliveryStatus,
    updateDeliveryInfo,
    getMyAllOrders,
    getMyAllOrdersForNonMember,
    getMyAllOrdersForGuest,
    getAllOrders,
    cancelOrder,
    deleteOrder,
    getCurrentOrder,
};
