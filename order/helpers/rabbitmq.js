const amqp = require('amqplib/callback_api');

let channel;
let connection;

// Initialize RabbitMQ
function connectToRabbitMQ() {
    amqp.connect('amqp://rabbitmq', (err, conn) => {
        if (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            setTimeout(connectToRabbitMQ, 5000); // Retry after 5 seconds
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
            channel.assertExchange('serviceExchange', 'direct', { durable: false });

            // Queue for orders
            channel.assertQueue('orderQueue', { durable: false });
            // channel.bindQueue('orderQueue', 'serviceExchange', 'order.created');

            channel.consume('orderQueue', msg => {
                if (msg.content) {
                    const order = JSON.parse(msg.content.toString());
                    console.log("Order received:", order);
                    // Handle order creation logic
                }
            }, { noAck: true });
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
