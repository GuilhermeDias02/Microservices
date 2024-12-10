const mongoose = require('mongoose');

// Définition du schéma pour le panier
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now },
});

// Création du modèle
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
