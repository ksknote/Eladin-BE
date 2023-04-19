const { Schema } = require('mongoose');

const ProductSchema = new Schema({
    productId: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
        required: true,
    },
});

module.exports = ProductSchema;
