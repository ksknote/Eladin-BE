const { Schema } = require('mongoose');

// [각 주문 정보]
const orderItemSchema = new Schema({
    productId: {
        type: Number,
        // ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    // 책 가격(API에 할인 가격이랑 원가랑 나눠져있음)
    price: {
        type: Number,
        required: true,
    },
});

// [총 주문 정보] 주문 정보, 배송지 정보, 배송 상태
const orderSchema = new Schema(
    {
        userId: {
            type: String,
            // ref: 'User',
            required: false,
        },
        uuid: {
            type: String,
            required: false,
        },
        items: [orderItemSchema],
        orderInfo: {
            // 주문 번호
            orderNumber: {
                type: Number,
                unique: true,
                required: true,
            },
            // 주문 총액
            totalPrice: {
                type: Number,
                required: true,
            },
        },
        deliveryInfo: {
            // 수령자 이름
            receiverName: {
                type: String,
                required: true,
            },
            // 수령자 연락처
            receiverPhone: {
                type: String,
                required: true,
                // match: [/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/, '유효하지 않은 전화번호입니다.'],
            },
            // 수령자 주소
            address: {
                type: String,
                required: true,
            },
            // 수령자 상세 주소
            addressDetail: {
                type: String,
                required: true,
            },
            // 수령자 우편 번호
            postCode: {
                type: String,
                required: true,
            },
            deliveryMessage: {
                type: String,
                required: false,
            },
        },
        // 배송 상태
        deliveryStatus: {
            type: String,
            enum: ['배송 준비 중', '배송 중', '배송 완료^^'],
            default: '배송 준비 중',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = orderSchema;
