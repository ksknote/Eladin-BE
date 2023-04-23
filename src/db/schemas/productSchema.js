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
        type: String,
        required: true,
        default: 'Unknown',
    },
    price: {
        type: Number,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    introduction: {
        type: String,
        required: false,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    bestSeller: {
        type: Boolean,
        required: true,
    },
    newBook: {
        type: Boolean,
        required: true,
    },
    recommend: {
        type: Boolean,
        required: true,
    },
    publisher: {
        type: String,
        required: true,
    },
});

module.exports = ProductSchema;
