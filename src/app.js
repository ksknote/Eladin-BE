'use strict';

//모듈
const express = require('express');
const app = express();

const connection = require('./db/db');

connection.connect((err) => {
    if (err) throw err;
    console.log('connected');
});

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send('Root page');
});


app.listen(8080, () => {
    console.log('server is running...');
});

module.exports = app;
