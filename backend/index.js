const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const MongoDB = require('./db');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

require('dotenv').config({ path: '../.env' });

MongoDB();


// Use cors middleware
app.use(cors({
    origin: "https://carhub-4uob.onrender.com",
}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://carhub-4uob.onrender.com");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // OpenAPI version
        info: {
            title: 'Car Management API', // API title
            version: '1.0.0', // API version
            description: 'A REST API for managing cars and user authentication', // API description
        },
    },
    apis: [__dirname + '/routes/*.js'], // Path to your route files where API docs are written
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', require('./Routes/CreateUser'))
app.use('/api', require('./Routes/Products'))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
