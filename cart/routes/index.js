const express = require('express');
const cartRouter = require('./cart.routes');

const app = express();

app.use('/', cartRouter);

module.exports = app;
