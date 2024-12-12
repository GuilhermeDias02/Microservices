const express = require('express');
const userRouter = require('./user.routes');

const app = express();

app.use('/', userRouter);

module.exports = app;
