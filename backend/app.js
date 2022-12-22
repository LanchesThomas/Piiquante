require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const headers = require('./middleware/headers');
const userRoute = require('./routes/user');
const saucesRoute = require('./routes/sauces');
const rateLimit = require('./middleware/rateLimit');

// CONNECTION A MONGODB
mongoose.connect(process.env.urlDb, function (err) {
    if (err) {
        throw err;
    } else {
        console.log('Connection MongoDb réussi');
    }
});

const app = express();

// MIDDLEWARE
app.use(rateLimit);
app.use(helmet({ crossOriginResourcePolicy: false })); // helmet headers
app.use(headers); // headers
app.use(cors()); // cors security

app.use(express.json()); // parser JSON queries
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use('/images', express.static('images')); // allow access to image from front

//ROUTES
app.use('/api/auth', userRoute);
app.use('/api/sauces', saucesRoute);

module.exports = app;
