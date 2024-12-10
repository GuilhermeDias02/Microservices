const mongoose = require('mongoose');

// Définition du schéma pour la commande
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

// Création du modèle
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
