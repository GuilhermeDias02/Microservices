const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const User = require('./models/User');
const app = express();
const port = 3001;
app.use(express.json());

// Connexion à MongoDB (assurez-vous que MongoDB est en cours d'exécution)
mongoose.connect('mongodb://mongo:27017/users-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

// Connexion à RabbitMQ
let channel, connection;
amqp.connect('amqp://rabbitmq', (err, conn) => {
    if (err) {
        console.error('Failed to connect to RabbitMQ:', err);
        process.exit(1);
    }
    connection = conn;
    connection.createChannel((err, ch) => {
        if (err) {
            console.error('Failed to create channel:', err);
            process.exit(1);
        }
        channel = ch;
        channel.assertQueue('userQueue', { durable: false });
    });
});

// Fonctionnalité 1 : Enregistrement d'un utilisateur
app.post('/users/register', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = new User({ name, email });
        await user.save();

        // Publier un message dans RabbitMQ
        channel.sendToQueue('userQueue', Buffer.from(JSON.stringify(user)));

        res.json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Fonctionnalité 2 : Récupérer un utilisateur par ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
});

// Fonctionnalité 3 : Lister tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});

app.get('/health', (req, res) => res.json({ message: 'Up and running'}))

app.listen(port, () => {
    console.log(`Users microservice running on http://localhost:${port}`);
});
