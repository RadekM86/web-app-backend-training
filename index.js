const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express()
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true }, 
    () => console.log('Connected to db!')
)

const authRoute = require('./routes/auth');

const productsRoute = require('./routes/products');

// Middlewares
app.use(express.json())
app.use('/api', authRoute)
app.use('/api', productsRoute)

app.listen(3000, () => console.log(
    'Server listening on port 3000'
))