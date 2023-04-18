const express = require('express');
const app = express();

app.get('/', (err, req, res) => {
    if (err) throw err;
    res.send('dd')
})
module.exports = app;