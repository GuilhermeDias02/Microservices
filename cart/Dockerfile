# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3002

# Define environment variables for MongoDB and RabbitMQ connection strings
ENV MONGO_URL=mongodb://mongo-carts:27018:2017/cart-db
ENV RABBITMQ_URL=amqp://rabbitmq

# Start the application
CMD ["node", "index.js"]
