require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const limiter = require('express-rate-limit');
const cors = require('./middleware/cors');
const userRoute = require('./routes/user');
const saucesRoute = require('./routes/sauces');

// CONNECTION A MONGODB
mongoose.connect(
    process.env.urlDb,
    function (err) {
        if (err) {
            throw err;
        } else {
            console.log('Connection MongoDb réussi');
        }
    }
);

const app = express();

// MIDDLEWARE
app.use(limiter({ // rate limit
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        code: 429,
        message: 'too many request'
    }
}))
app.use(helmet({ crossOriginResourcePolicy: false })); // helmet headers
app.use(cors); // cors security
app.use(express.json()); // parser JSON queries
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use('/images', express.static('images')); // allow access to image from front

//ROUTES
app.use('/api/auth', userRoute);
app.use('/api/sauces', saucesRoute);

module.exports = app;
