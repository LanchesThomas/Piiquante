const jwt = require('jsonwebtoken');

// authentification verify
module.exports = (req, res, next) => {
    try {
        const token = req.header('authorization').split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.tokenSecret);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId,
        };
        if (req.auth) {
            next();
        }
    } catch (error) {
        console.log('non authentifié');
        res.status(401).json({ error });
    }
};
