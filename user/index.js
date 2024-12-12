const express = require('express');
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./routes');
const port = 3001;

app.use(express.json());

// Connexion à MongoDB (assurez-vous que MongoDB est en cours d'exécution)
mongoose.connect('mongodb://mongo:27017/users-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
    res.send({message: 'Up and running'})
})

app.listen(port, () => {
    console.log(`Users microservice running on http://localhost:${port}`);
});
