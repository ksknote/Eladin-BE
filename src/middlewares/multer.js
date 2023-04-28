const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

const processImage = (req, res, next) => {
    upload.single('imageFile')(req, res, (err) => {
        if (err) {
            return next(new AppError(400, '업로드중 에러 발생'));
        } else {
            next();
        }
    });
};

module.exports = { processImage };
