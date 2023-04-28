const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { AppError } = require('./errorHandler');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // filename: (req, file, cb) => {
    //     cb(null, Date.now() + path.extname(file.originalname));
    // },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

// const processImage = (req, res, next) => {
//     upload.single('img'),
//         (req, res) => {
//             res.status(200).json({ message: 'Image uploaded successfully!' });
//             next();
//         };
// };

const processImage = (req, res, next) => {
    upload.single('imageFile')(req, res, (err) => {
        if (err) {
            // 업로드 중 에러 발생 시 처리
            return next(new AppError(400, '업로드중 에러 발생'));
        } else {
            // 업로드 완료 시 다음 미들웨어 호출
            // req.body.filename = req.file.originalname;
            // req.file.filepath = req.file.path;
            // req.body.imageFile = req.file.filename;
            console.log('req.file @@@@@@@@@', req.file); // 업로드된 파일 정보
            console.log('req.body @@@@@@@@@', req.body); // 일반 텍스트 데이터
            next();
        }
    });
};

module.exports = { processImage };
