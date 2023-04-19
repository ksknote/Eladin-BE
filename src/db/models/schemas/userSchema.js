const { Schema } = require('mongoose');

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
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
    },
    {
        timestamps: true,
    }
);

module.exports = UserSchema;
