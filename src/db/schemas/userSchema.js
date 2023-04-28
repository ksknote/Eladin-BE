const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const UserSchema = new Schema(
    {
        userId: {
            type: String,
            required: false,
            unique: true,
            default: uuidv4,
        },
        uuid: {
            type: String,
            required: false,
            default: uuidv4,
            // default: uuid.v4(),
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/],
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            match: [/^[a-zA-Z0-9가-힣]+$/],
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
