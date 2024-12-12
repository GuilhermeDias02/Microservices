const express = require('express')
const mongoose = require('mongoose');
const app = express();
const apiRouter = require('./routes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const port = 3001;
app.use(express.json());

mongoose.connect('mongodb://mongo-users:27017/users-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB:', err));

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Users API',
            version: '1.0.0'
        },
        servers: [
            {
                url: `http://localhost:${port}/`
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },

    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/api', apiRouter);

app.get('/health', (req, res) => {
    res.send({message: 'Up and running'})
})

app.listen(port, () => {
    console.log(`Users microservice running on http://localhost:${port}`);
});
