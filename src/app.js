const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const env = require('./envconfig');
const { connectToDatabase } = require('./db/db');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');

const port = Number(env.PORT || 3000);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDatabase()
    .then((db) => {
        app.use('/', indexRouter);

        app.listen(port, () => {
            console.log('포트 :', env.PORT);
            console.log('데이터베이스 호스트: ', env.DB_HOST);
            console.log('데이터베이스 이름:', env.DB_NAME);
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

app.use('/auth', authRouter);
app.use('/orders', orderRouter);
app.use('/products', productRouter);
