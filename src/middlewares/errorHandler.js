class AppError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

const errorHandlerMiddleware = (err, req, res, next) => {
    const { statusCode, message } = err;
    res.status(statusCode || 500).json({
        status: 'error',
        statusCode: statusCode || 500,
        message: message || '서버에서 에러가 발생했습니다.',
    });
};

module.exports = {
    AppError,
    errorHandlerMiddleware,
};
