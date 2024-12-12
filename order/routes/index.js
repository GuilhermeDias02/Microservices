const express = require('express');
const orderRouter = require('./order.routes');

const app = express();

app.use('/', orderRouter);

module.exports = app;
