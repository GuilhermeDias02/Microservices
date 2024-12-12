const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMessageToQueue } = require("../helpers/rabbitmq");

exports.register = async (req, res) => {
    let { name, email, password } = req.body;
    console.log('Registering user:', { name, email }); 
    try {
        password = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully'); 

        const user = new User({ name, email, password });
        await user.save();
        console.log('User saved to database:', user); 

        const sent = sendMessageToQueue('userQueue', user);
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ. Logging but continuing...');
        } else {
            console.log('Message sent to RabbitMQ for user:', user.email); 
        }

        res.json({ message: 'User registered successfully', user });
    } catch (err) {
        console.error('Error during user registration:', err); 
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}

exports.login = async (req, res) => {
    console.log('Login attempt:', { email: req.body.email }); 
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.warn('Login failed: User not found'); 
            return res.status(401).send({ message: 'Email or Password wrong' });
        }

        console.log('User found:', user.email);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.warn('Login failed: Incorrect password'); 
            return res.status(401).send({ message: 'Email or Password wrong' });
        }

        const userData = { email: user.email };
        const secret = 'secret';
        const jwtData = { expiresIn: '1h' };

        const sent = sendMessageToQueue('notificationQueue', { email, name: user.name, message: 'You have been logged in' });
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ. Logging but continuing...');
        } else {
            console.log('Login notification sent to RabbitMQ for user:', email); 
        }

        const token = jwt.sign(userData, secret, jwtData);
        console.log('JWT generated:', token);

        res.status(200).send({
            message: 'Successfully logged in',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                token
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({
            message: error.message || 'some error occurred while logging user'
        });
    }
}

exports.getUser = async (req, res) => {
    const userId = req.params.id;
    console.log('Fetching user by ID:', userId);
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.warn('User not found with ID:', userId); 
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User retrieved:', user); 
        res.json({ user: { id: user._id, email: user.email, name: user.name } });
    } catch (err) {
        console.error('Error retrieving user:', err); 
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
}

exports.getUsers = async (req, res) => {
    console.log('Fetching all users'); // Log input
    try {
        const users = await User.find().select('-password');
        console.log('Users retrieved:', users.length);
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err); 
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
}
