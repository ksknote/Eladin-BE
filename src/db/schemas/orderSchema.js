const { Schema } = require('mongoose');

// [각 주문 정보]
const orderItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema],
        orderInfo: {
            // 주문 번호
            orderNumber: {
                type: String,
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
            },
            // 수령자 주소
            address: {
                type: String,
                required: true,
            },
            // 수령자 우편 번호
            postCode: {
                type: String,
                required: true,
            },
        },
        // 배송 상태
        deliveryStatus: {
            type: String,
            enum: ['pending', 'processing', 'delivered'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = orderSchema;
