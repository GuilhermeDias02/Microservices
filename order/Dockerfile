# Use the official Node.js 18 image as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3003

# Define environment variables for MongoDB and RabbitMQ connection strings
ENV MONGO_URL=mongodb://mongo-orders:27019:27017/orders-db
ENV RABBITMQ_URL=amqp://rabbitmq

# Start the application
CMD ["node", "index.js"]
