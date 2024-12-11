const express = require('express');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./routes');
const port = 3002;
app.use(express.json());

// Connexion à MongoDB (assurez-vous que MongoDB est en cours d'exécution)
mongoose.connect('mongodb://mongo:27017/cart-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/carts', apiRouter)

app.get('/health', (req, res) => {
    res.json({message: 'Up and running'})
})

app.listen(port, () => {
    console.log(`Cart microservice running on http://localhost:${port}`);
});
