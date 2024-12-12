const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMessageToQueue } = require("../helpers/rabbitmq");

exports.register = async (req, res) => {
    let { name, email, password } = req.body;
    try {
        password = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password });

        await user.save();

        const sent = sendMessageToQueue('userQueue', user);
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ. Logging but continuing...');
        }

        res.json({ message: 'User registered successfully', user });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }

}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ message: 'Email or Password wrong' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).send({ message: 'Email or Password wrong' });
        }

        const userData = {
            email: user.email
        };
        const secret = 'secret';
        const jwtData = {
            expiresIn: '1h'
        };

        const sent = sendMessageToQueue('notificationQueue', { email, name, message: 'You have been logged in' });
        if (!sent) {
            console.warn('Failed to send message to RabbitMQ. Logging but continuing...');
        }

        const token = jwt.sign(userData, secret, jwtData);

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
        res.status(500).send({
            message: error.message || 'some error occurred while logging user'
        });
    }
}

exports.getUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({user: { id: user._id, email: user.email, name: user.name }});
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user', error: err.message });
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
}
