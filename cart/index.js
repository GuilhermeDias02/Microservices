const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const Cart = require('./models/Cart');
const app = express();
const port = 3002;
app.use(express.json());

// Connexion à MongoDB (assurez-vous que MongoDB est en cours d'exécution)
mongoose.connect('mongodb://mongo:27017/cart-db', { useNewUrlParser: true, useUnifiedTopology: true })
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
        channel.assertExchange('serviceExchange', 'direct', { durable: false });

        // Queue for carts
        channel.assertQueue('cartQueue', { durable: false });
        channel.bindQueue('cartQueue', 'serviceExchange', 'cart.updated');

        channel.consume('cartQueue', msg => {
            if (msg.content) {
                const event = JSON.parse(msg.content.toString());
                if (event.event === 'order.paid') {
                    const { userId } = event;
                    // Clear the cart for the specific user
                    Cart.findOneAndDelete({ userId }, (err, cart) => {
                        if (err) {
                            console.error('Error clearing cart:', err);
                        } else {
                            console.log(`Cart cleared for user ${userId}`);
                        }
                    });
                }
            }
        }, { noAck: true });
    });
});

// Fonctionnalité 1 : Afficher le panier d'un utilisateur
app.get('/carts/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving cart', error: err.message });
    }
});

// Fonctionnalité 2 : Ajouter un produit au panier
app.post('/carts/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { productId, name, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, name, quantity }] });
        } else {
            cart.items.push({ productId, name, quantity });
        }

        await cart.save();

        // Publier un message dans RabbitMQ pour notifier l'ajout d'un produit
        channel.sendToQueue('cartQueue', Buffer.from(JSON.stringify(cart)));

        res.json({ message: 'Product added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error adding product to cart', error: err.message });
    }
});

// Fonctionnalité 3 : Vider le panier
app.delete('/carts/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json({ message: 'Cart cleared', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing cart', error: err.message });
    }
});

app.get('/health', (req, res) => res.json({ message: 'Up and running'}))

app.listen(port, () => {
    console.log(`Cart microservice running on http://localhost:${port}`);
});
