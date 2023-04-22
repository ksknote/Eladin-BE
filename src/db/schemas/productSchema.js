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
