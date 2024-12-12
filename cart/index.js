const express = require('express');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./routes');
const port = 3002;
app.use(express.json());

mongoose.connect('mongodb://mongo-carts:27017/cart-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api', apiRouter)

app.get('/health', (req, res) => {
    res.send({message: 'Up and running'})
})

app.listen(port, () => {
    console.log(`Cart microservice running on http://localhost:${port}`);
});
