const Order = require('../models/Order');
const { sendMessageToQueue } = require("../helpers/rabbitmq");

exports.createOrder = async (req, res) => {
    const userId = req.params.userId;
    const { cartId, totalAmount } = req.body;
    try {
        const order = new Order({ userId, cart: cartId, totalAmount });
        await order.save();

        res.json({ message: 'Order created successfully', order });
    } catch (err) {
        res.status(500).json({ message: 'Error creating order', error: err.message });
    }
}

exports.getOrder = async (req, res) => {
    const userId = req.params.userId;
    try {
        const orders = await Order.find({ userId });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
}

exports.payOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findByIdAndUpdate(orderId, { status: 'paid' }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const message = {
            userId: order.userId,
            orderId: order._id,
            event: 'order.paid'
        };

        const sent = sendMessageToQueue('cartQueue', message);
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ.');
        }

        res.json({ message: 'Order has been paid', order });
    } catch (err) {
        res.status(500).json({ message: 'Error processing payment', error: err.message });
    }
}
