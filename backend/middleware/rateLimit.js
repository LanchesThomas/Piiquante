const limiter = require('express-rate-limit');

module.exports = (limiter({ // rate limit
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        code: 429,
        message: 'too many request'
    }
}))