const { Schema } = require('mongoose');
// pdf >> 주문 번호, 배송지 정보(수령자, 핸드폰번호, 주소, 우편번호), 배송 방법, 배송 메모 등

// [주문 목록 페이지] 각 주문 정보 >> 주문한 책, 주문 수량, 책 가격
const orderItemSchema = new Schema({
    product: {
        type: String,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

// [주문 완료 페이지] 총 주문 정보 >> 주문한 사용자, 주문한 책들, 주문 총액, 우편번호, 배송지 주소, 핸드폰 번호
const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [orderItemSchema], // 하나의 주문 내에 여러 상품이 존재할 때 'items: orderItem' 스키마 배열로 조회
        totalPrice: {
            type: Number,
            required: true,
        },
        postCode: {
            type: Number,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = orderSchema;
