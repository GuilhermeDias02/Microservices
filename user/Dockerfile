# Use the official Node.js 20 image as a parent image
FROM node:20.10.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app runs on
EXPOSE 3001

# Define environment variable for MongoDB and RabbitMQ connection strings
ENV MONGO_URL=mongodb://mongo-users:27017:27017/users-db
ENV RABBITMQ_URL=amqp://rabbitmq

# Start the application
CMD ["npm", "run","start"]
