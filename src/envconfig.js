require('dotenv').config();

module.exports = {
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    // AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    // AWS_BUCKET_REGION: process.env.AWS_BUCKET_REGION,
    // AWS_IDENTITY_POOL_ID: process.env.AWS_IDENTITY_POOL_ID,
    // AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    // AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};
