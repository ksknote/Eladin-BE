const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const env = require('./envconfig');
const { connectToDatabase } = require('./db/db');
const { insertDummyUsers } = require('./db/userDummyData');
const { insertDummyProducts } = require('./db/productDummyData');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/authRouter');
const orderRouter = require('./routes/orderRouter');
const productRouter = require('./routes/productRouter');

const port = Number(env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectToDatabase()
    .then(async (db) => {
        app.use('/', indexRouter);

        await insertDummyUsers();
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
app.use('/products', productRouter);
