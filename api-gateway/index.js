const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware pour parser le JSON
app.use(express.json());

// API Users
// 1. Enregistrement d'un utilisateur
app.post('/users/register', async (req, res) => {
    try {
        const response = await axios.post('http://user:3001/users/register', req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Users service', error: err.message });
    }
});

// 2. Récupérer un utilisateur par ID
app.get('/users/:id', async (req, res) => {
    try {
        const response = await axios.get(`http://user:3001/users/${req.params.id}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Users service', error: err.message });
    }
});

// 3. Récupérer tous les utilisateurs
app.get('/users/', async (req, res) => {
    try {
        const response = await axios.get(`http://user:3001/users/`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Users service', error: err.error });
    }
});

app.get('/users/health', async (req, res) => {
    try {
        const response = await axios.get('http://user:3001/health');
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Users service', error: err.message });
    }
})

// API Cart
// 1. Afficher le panier d'un utilisateur
app.get('/carts/:userId', async (req, res) => {
    try {
        const response = await axios.get(`http://cart:3002/carts/${req.params.userId}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Cart service', error: err.message });
    }
});

// 2. Ajouter un produit au panier
app.post('/carts/:userId', async (req, res) => {
    try {
        const response = await axios.post(`http://cart:3002/carts/${req.params.userId}`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Cart service', error: err.message });
    }
});

// 3. Vider le panier
app.delete('/carts/:userId', async (req, res) => {
    try {
        const response = await axios.delete(`http://cart:3002/carts/${req.params.userId}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Cart service', error: err.message });
    }
});

app.get('/carts/health', async (req, res) => {
    try {
        const response = await axios.get('http://cart:3002/health');
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Cart service', error: err.message });
    }
})

// API Orders
// 1. Créer une commande
app.post('/orders/:userId', async (req, res) => {
    try {
        const response = await axios.post(`http://order:3003/orders/${req.params.userId}`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Orders service', error: err.message });
    }
});

// 2. Obtenir les commandes d'un utilisateur
app.get('/orders/:userId', async (req, res) => {
    try {
        const response = await axios.get(`http://order:3003/orders/${req.params.userId}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Orders service', error: err.message });
    }
});

// 3. Mettre à jour le statut d'une commande
app.put('/orders/:orderId/status', async (req, res) => {
    try {
        const response = await axios.put(`http://order:3003/orders/${req.params.orderId}/status`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Orders service', error: err.message });
    }
});

app.put('/orders/:orderId/pay', async (req, res) => {
    try {
        const response = await axios.put(`http://order:3003/orders/${req.params.orderId}/pay`, req.body);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Orders service', error: err.message });
    }
});

app.get('/orders/health', async (req, res) => {
    try {
        const response = await axios.get('http://order:3003/health');
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Error calling Users service', error: err.message });
    }
})

// Lancer l'API Gateway
app.listen(port, () => {
    console.log(`API Gateway running on http://localhost:${port}`);
});
