const mongoose = require('mongoose');

const UserSchema = require('./models/schemas/userSchema');
const ProductSchema = require('./models/schemas/productSchema');
const orderSchema = require('./models/schemas/orderSchema');

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', orderSchema);

module.exports = {
    User,
    Product,
    Order,
};
