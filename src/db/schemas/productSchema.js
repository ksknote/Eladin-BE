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
        minlength: 1,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: false,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    introduction: {
        type: String,
        required: false,
        trim: true,
    },
    imgUrl: {
        type: String,
        required: false,
        trim: true,
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
        trim: true,
    },
});

module.exports = ProductSchema;
