const amqp = require('amqplib/callback_api');

let channel;
let connection;

function connectToRabbitMQ() {
    amqp.connect('amqp://rabbitmq', (err, conn) => {
        if (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            setTimeout(connectToRabbitMQ, 5000);
            return;
        }
        connection = conn;
        console.log('RabbitMQ connected.');

        connection.createChannel((err, ch) => {
            if (err) {
                console.error('Failed to create RabbitMQ channel:', err);
                return;
            }
            channel = ch;
            channel.assertQueue('userQueue', { durable: true });
            console.log('RabbitMQ channel and queue initialized.');
        });

        connection.on('close', () => {
            console.warn('RabbitMQ connection closed. Reconnecting...');
            setTimeout(connectToRabbitMQ, 5000);
        });

        connection.on('error', (error) => {
            console.error('RabbitMQ connection error:', error);
        });
    });
}

function sendMessageToQueue(queueName, message) {
    if (!channel) {
        console.error('Cannot send message, RabbitMQ channel not initialized.');
        return false;
    }
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
    console.log(`Message sent to queue: ${queueName}`);
    return true;
}

connectToRabbitMQ();

module.exports = {
    sendMessageToQueue,
};
