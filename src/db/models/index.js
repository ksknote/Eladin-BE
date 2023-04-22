const mongoose = require('mongoose');

const UserSchema = require('../schemas/userSchema');
const ProductSchema = require('../schemas/productSchema');
const orderSchema = require('../schemas/orderSchema');

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
    User,
    Product,
    Order,
};
