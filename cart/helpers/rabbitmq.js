const amqp = require('amqplib/callback_api');
const Cart = require("../models/Cart");

let channel;
let connection;

// Initialize RabbitMQ
function connectToRabbitMQ() {
    amqp.connect('amqp://rabbitmq', (err, conn) => {
        if (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            setTimeout(connectToRabbitMQ, 5000); // Retry after a delay
            return;
        }
        connection = conn;
        console.log('RabbitMQ connected.');

        connection.createChannel((err, ch) => {
            if (err) {
                console.error('Failed to create channel:', err);
                process.exit(1);
            }
            channel = ch;


            channel.assertQueue('cartQueue', { durable: false }, (err, ok) => {
                if (err) {
                    console.error('Error asserting cartQueue:', err);
                } else {
                    console.log('cartQueue declared successfully.');
                }
            });

            // // 3. Bind cartQueue to the serviceExchange with routing key 'cart.updated'
            // channel.bindQueue('cartQueue', 'serviceExchange', 'cart.updated', {}, (err, ok) => {
            //     if (err) {
            //         console.error('Error binding cartQueue to exchange:', err);
            //     } else {
            //         console.log(
            //             'cartQueue successfully bound to serviceExchange with routing key "cart.updated".'
            //         );
            //     }
            // });

            // 4. Consume messages
            console.log('Starting to consume messages from cartQueue...');
            channel.consume(
                'cartQueue',
                async (msg) => {
                    console.log('Received message from cartQueue:', msg.content.toString());
                    if (msg.content) {
                        const event = JSON.parse(msg.content.toString());
                        if (event.event === 'order.paid') {
                            const { userId } = event;
                            console.log('User with id', userId, 'has paid their order.');

                            // Logic to delete the user's cart
                            await Cart.findOneAndDelete({ userId })
                        }
                    }
                },
                { noAck: true }
            );
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed. Reconnecting...');
            setTimeout(connectToRabbitMQ, 5000); // Retry connection
        });

        connection.on('error', (error) => {
            console.error('RabbitMQ connection error:', error);
        });
    });
}

// Sends a message to RabbitMQ
function sendMessageToQueue(queueName, message) {
    if (!channel) {
        console.error('Cannot send message, RabbitMQ channel not initialized.');
        return false;
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue: ${queueName}`);
    return true;
}

// Connect to RabbitMQ when the app starts
connectToRabbitMQ();

module.exports = {
    sendMessageToQueue,
};
