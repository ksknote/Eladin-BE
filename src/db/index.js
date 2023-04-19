const mongoose = require("mongoose");

const UserSchema = require("./models/schemas/userSchema");
const ProductSchema = require("./models/schemas/productSchema");
const orderSchema = require("./models/schemas/orderSchema");

exports.User = mongoose.model("User", UserSchema);
exports.Product = mongoose.model("Product", ProductSchema);
exports.Order = mongoose.model("Order", orderSchema);
