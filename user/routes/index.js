const express = require('express');
const userRouter = require('./order.routes');

const app = express();

app.use('/', userRouter);

module.exports = app;
