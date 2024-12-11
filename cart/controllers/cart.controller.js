const Cart = require('../models/Cart');
const { sendMessageToQueue } = require("../helpers/rabbitmq");

exports.getCart = async (req, res) => {
    const userId = req.params.userId;
    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = {}
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving cart', error: err.message });
    }
}

exports.addToCart = async (req, res) => {
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

        res.json({ message: 'Product added to cart', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error adding product to cart', error: err.message });
    }
}

exports.emptyCart = async (req, res) => {
    const userId = req.params.userId;
    try {
        const cart = await Cart.findOneAndDelete({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const sent = sendMessageToQueue('cartQueue', "Cart deleted");
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ. Logging but continuing...');
        }

        res.json({ message: 'Cart cleared', cart });
    } catch (err) {
        res.status(500).json({ message: 'Error clearing cart', error: err.message });
    }
}
