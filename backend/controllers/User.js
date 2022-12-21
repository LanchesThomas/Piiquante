const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// sign up
exports.signUp = (req, res, next) => {
    bcrypt // crypt password in database
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: 'Utilisateur créé' })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

// login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (null) {
                res.status(404).json({
                    message: "Paire d'identifiant incorrect",
                });
            } else {
                bcrypt // find users in database
                    .compare(req.body.password, user.password)
                    .then((valid) => {
                        if (!valid) {
                            res.status(404).json({
                                message: "Paire d'identifiant incorrect",
                            });
                        } else {
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.tokenSecret,
                                    { expiresIn: '24h' }
                                ),
                            });
                        }
                    })
                    .catch((error) => res.status(500).json({ error }));
            }
        })
        .catch(() =>
            res.status(404).json({ message: "Paire d'identifiant incorrect" })
        );
};
