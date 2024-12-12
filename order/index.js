const express = require('express');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./routes');
const port = 3003;
app.use(express.json());

mongoose.connect('mongodb://mongo-orders:27017/orders-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api', apiRouter)

app.get('/health', (req, res) => {
    res.send({message: 'Up and running'})
})

app.listen(port, () => {
    console.log(`Orders microservice running on http://localhost:${port}`);
});
