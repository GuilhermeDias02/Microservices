const mongoose = require('mongoose');

// Définition du schéma pour l'utilisateur
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

// Création du modèle
const User = mongoose.model('User', userSchema);

module.exports = User;
