const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const Order = require('./models/Order');
const app = express();
const port = 3003;
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://mongo:27017/orders-db', { useNewUrlParser: true, useUnifiedTopology: true })
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

        // Queue for orders
        channel.assertQueue('orderQueue', { durable: false });
        channel.bindQueue('orderQueue', 'serviceExchange', 'order.created');

        channel.consume('orderQueue', msg => {
            if (msg.content) {
                const order = JSON.parse(msg.content.toString());
                console.log("Order received:", order);
                // Handle order creation logic
            }
        }, { noAck: true });
    });
});

// Fonctionnalité 1 : Créer une commande
app.post('/orders/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { cartId, totalAmount } = req.body;
    try {
        const order = new Order({ userId, cart: cartId, totalAmount });
        await order.save();

        // Publier un message dans RabbitMQ pour notifier la création de la commande
        channel.sendToQueue('orderQueue', Buffer.from(JSON.stringify(order)));

        res.json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
});

// Fonctionnalité 2 : Afficher les commandes d'un utilisateur
app.get('/orders/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
});

// Fonctionnalité 3 : Mettre à jour le statut de la commande
app.put('/orders/:id/status', async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'paid') {

        }
        res.json({ message: 'Order status updated', order });
    } catch (err) {
        res.status(500).json({ message: 'Error updating order status', error: err.message });
    }
});

app.put('/orders/:id/pay', async (req, res) => {
    const orderId = req.params.id;
    try {
        // Assume the payment process is handled here and is successful
        const order = await Order.findByIdAndUpdate(orderId, { status: 'paid' }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Notify other microservices about the order payment.
        const message = {
            userId: order.userId,
            orderId: order._id,
            event: 'order.paid'
        };

        // Publish the "order paid" event indicating the cart should be emptied
        channel.sendToQueue('cartQueue', Buffer.from(JSON.stringify(message)));

        res.json({ message: 'Order has been paid', order });
    } catch (err) {
        res.status(500).json({ message: 'Error processing payment', error: err.message });
    }
});

app.get('/health', (req, res) => res.json({ message: 'Up and running'}))

app.listen(port, () => {
    console.log(`Orders microservice running on http://localhost:${port}`);
});
