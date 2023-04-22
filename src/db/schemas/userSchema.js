const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+@.+..+/,
        },
        userName: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        tokens: {
            accessToken: {
                type: String,
            },
            refreshToken: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
