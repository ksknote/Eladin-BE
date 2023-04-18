"use strict";

//모듈
const express = require('express');
const app = express();


const connection = require('./db/db');

connection.connect((err) => {
  if (err) throw err;
  console.log("connected");
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    connection.query('SELECT * FROM user', (err, results, field) => {
        console.log(results);
        res.send("Completed Server Setting!");
    });
});

module.exports = app;