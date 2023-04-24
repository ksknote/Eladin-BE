const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const env = require('./envconfig');
const { connectToDatabase } = require('./db/db');
const { insertDummyOrders, insertDummyUsers, insertDummyProducts } = require('./db/dummyDatas.js');
const { errorHandlerMiddleware } = require('./middlewares/errorHandler');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter');
const port = Number(env.PORT || 3000);
const allowedOrigins = [
    'http://localhost:5501',
    'http://localhost:5502',
    'http://localhost:5500',
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:8080',
    'http://localhost:3001',
    'http://localhost:3002',
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true, // 쿠키를 허용하기 위한 설정
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDatabase()
    .then(async (db) => {
        app.use('/', indexRouter);

        // await insertDummyOrders();
        // await insertDummyUsers();
        await insertDummyProducts();

        app.listen(port, () => {
            console.log('PORT:', env.PORT);
            console.log('DB_HOST:', env.DB_HOST);
            console.log('DB_NAME:', env.DB_NAME);
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use('/books', productRouter);
app.use(errorHandlerMiddleware);
