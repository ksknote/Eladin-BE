const { Order } = require('../db/models/index');

const orderService = {
    // 임의 6자리 주문번호
    getOrderNumber() {
        return Math.floor(Math.random() * 900000) + 100000;
    },

    // 주문 총액
    getTotalPrice(items) {
        return items.reduce((acc, product) => acc + product.price);
    },

    // [사용자 전용] 주문 추가 - 추가할 때 마다 새로운 주문번호 생성
    async createOrder(req, res) {
        try {
            const { userId, items, deliveryInfo } = req.body;

            // const orderNumber = this.getOrderNumber();
            // const totalPrice = this.getTotalPrice(items);
            const orderNumber = Math.floor(Math.random() * 900000) + 100000;
            const totalPrice = items.reduce((acc, product) => acc + product.price, 0);

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

            console.log('주문 추가 내용 : ', createdOrder);

            res.status(201).json({ message: '주문 추가 성공', data: createdOrder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 추가 실패' });
        }
    },

    // [관리자] 주문 수정 - 배송상태 수정
    async updateDeliveryStatus(req, res) {
        try {
            const { orderNumber } = req.params;
            const { deliveryStatus } = req.body;

            const updatedOrder = await Order.updateOne(
                { 'orderInfo.orderNumber': orderNumber },
                { deliveryStatus },
                { new: true }
            );

            res.status(201).json({ message: '배송상태 수정 성공', data: updatedOrder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '배송상태 수정 실패' });
        }
    },

    // [사용자] 주문 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
    async updateDeliveryInfo(req, res) {
        try {
            const { orderNumber } = req.params;
            const { items, deliveryInfo, deliveryStatus } = req.body;

            const newOrderNumber = Math.floor(Math.random() * 900000) + 100000;
            const newTotalPrice = items.reduce((acc, product) => acc + product.price, 0);

            if (deliveryStatus === 'pending') {
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

                res.status(201).json({ message: '주문정보 수정 성공', data: updatedOrder });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문정보 수정 실패' });
        }
    },

    // [사용자] 주문 완료 - 현재 주문내역 조회
    async getCurrentOrder(req, res) {
        try {
            const { orderNumber } = req.params;

            const foundOrder = await Order.findOne(
                { 'orderInfo.orderNumber': orderNumber },
                { items: 0 } // 책 정보 제외
            );

            res.status(201).json({ message: '현재 주문내역 조회 성공', data: foundOrder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '현재 주문내역 조회 실패' });
        }
    },

    // [사용자] 주문 조회 - 개인 주문내역 조회
    async getOrdersByUserId(req, res) {
        try {
            const { userId } = req.params;

            const foundOrders = await Order.find({ userId });

            res.status(201).json({ message: '사용자 전체 주문내역 조회 성공', data: foundOrders });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '사용자 전체 주문내역 조회 실패' });
        }
    },

    // [관리자] 주문 조회 - 전체 주문내역 조회
    async getAllOrders(req, res) {
        try {
            const foundAllOrders = await Order.find({});

            res.status(201).json({
                message: '관리자 전체 주문내역 조회 성공',
                data: foundAllOrders,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '관리자 전체 주문내역 조회 실패' });
        }
    },

    // [사용자] 주문 취소 - 사용자 주문 취소
    async cancelOrder(req, res) {
        try {
            const { orderNumber } = req.params;

            const foundOrder = await Order.findOne({ 'orderInfo.orderNumber': orderNumber });

            if (foundOrder.deliveryStatus === 'pending') {
                const canceledOrder = await foundOrder.deleteOne({
                    'orderInfo.orderNumber': orderNumber,
                });

                res.status(201).json({ message: '주문 취소 성공', data: canceledOrder });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 취소 실패' });
        }
    },

    // [관리자] 주문 삭제 - 관리자 주문 삭제
    async deleteOrder(req, res) {
        try {
            const { orderNumber } = req.params;

            const deletedOrder = await Order.deleteOne({ 'orderInfo.orderNumber': orderNumber });

            res.status(201).json({ message: '주문 삭제 성공', data: deletedOrder });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 삭제 실패' });
        }
    },
};

module.exports = orderService;
