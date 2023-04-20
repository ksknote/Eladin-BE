const { Order } = require('../db/index');

const orderService = {
    // 임의 6자리 주문번호
    getOrderNumber() {
        return Math.floor(Math.random() * 900000) + 100000;
    },

    // 주문 총액
    getTotalPrice(items) {
        return items.reduce((acc, product) => acc + product.price);
    },

    // [사용자 전용] 주문 추가 - 추가할 때 마다 새로운 주문번호 생성(주문 번호로 필터링)
    async createOrder(req, res) {
        const { userId, items, deliveryInfo } = req.body;

        const orderNumber = this.getOrderNumber();
        const totalPrice = this.getTotalPrice();

        const createInfo = {
            userId,
            items,
            deliveryInfo,
            orderInfo: {
                orderNumber,
                totalPrice,
            },
        };

        try {
            const createOrder = await Order.create({ createInfo });

            console.log('주문 추가 내용 : ', createOrder);

            res.status(201).json({ message: '주문 추가 성공' });

            req.session.valid = createInfo.orderInfo; // 세션으로 주문정보 전달
            res.redirect('/주문완료 페이지');
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 추가 실패' });
        }
    },

    // [관리자 전용] 배송상태 수정
    // root : 관리자 전체 주문내역 페이지
    async updateDeliveryStatus(req, res) {
        const { orderNumber } = req.params.orderInfo;
        const { deliveryStatus } = req.body;

        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                { orderNumber },
                { deliveryStatus },
                { new: true }
            );

            res.status(201).json(updatedOrder);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '배송상태 수정 실패' });
        }
    },

    // [사용자 전용] 주문 정보 수정 - 배송 시작 전까지 주문내역, 배송지정보 수정
    // root : 사용자 주문 내역 페이지
    async updateDeliveryInfo(req, res) {
        const { orderNumber } = req.params.orderInfo;
        const { items, deliveryInfo, deliveryStatus } = req.body;

        const newOrderNumber = this.getOrderNumber();
        const newTotalPrice = this.getTotalPrice();

        try {
            if (deliveryStatus === 'preparing') {
                const updatedOrder = await Order.findByIdAndUpdate(
                    { orderNumber },
                    {
                        items, // 주문한 책 정보
                        deliveryInfo,
                        orderInfo: {
                            orderNumber: newOrderNumber,
                            totalPrice: newTotalPrice,
                        },
                    },
                    { new: true }
                );

                res.status(201).json(updatedOrder);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문정보 수정 실패' });
        }
    },

    // [사용자 전용] 주문 완료 - 현재 주문내역 조회
    async orderCompleted(req, res) {
        const { orderNumber } = req.session.valid; // 주문 추가에서 받아온 세션 값
        req.session.valid = null; // 세션 제거

        try {
            const foundOrder = await Order.findOne({ orderNumber }, { items: 0 }); // 책 정보 제외

            res.status(201).json(foundOrder);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '현재 주문내역 조회 실패' });
        }
    },

    // [사용자 전용] 주문 조회 - 전체 주문내역 조회
    async getOrdersByUserId(req, res) {
        const { userId } = req.parmas;

        try {
            const foundOrders = await Order.find({ userId });

            res.status(201).json(foundOrders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '사용자 전체 주문내역 조회 실패' });
        }
    },

    // [관리자 전용] 주문 조회 - 전체 이용자 주문내역 조회
    async getAllOrders(req, res) {
        try {
            const foundAllOrders = await Order.find({});

            res.status(201).json(foundAllOrders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '관리자 전체 주문내역 조회 실패' });
        }
    },

    // [사용자 전용] 주문 취소
    async cancelOrder(req, res) {
        const { orderNumber } = req.params.orderInfo;

        try {
            const foundOrder = await Order.find({ orderNumber });
            if (foundOrder.deliveryStatus === 'pending') {
                await foundOrder.deleteOne({ orderNumber });

                res.status(201).json({ message: '주문 취소 성공' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 취소 실패' });
        }
    },

    // [관리자 전용] 주문 삭제
    async deleteOrder(req, res) {
        const { orderNumber } = req.params.orderInfo;

        try {
            await Order.findByIdAndDelete({ orderNumber });

            res.status(201).json({ message: '주문 삭제 성공' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: '주문 삭제 실패' });
        }
    },
};

module.exports = orderService;
