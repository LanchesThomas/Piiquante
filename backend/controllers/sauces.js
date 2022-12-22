const Sauce = require('../models/sauces');
const fs = require('fs');

// find all sauces
exports.Sauces = (req, res, next) => {
    Sauce.find()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};

// find one sauce
exports.oneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => res.status(404).json({ error }));
};

// add sauce
exports.addSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });
    sauce
        .save()
        .then((message) => res.status(201).send({ message }))
        .catch((error) => res.status(500).json({ error }));
};

// modify sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : {
              ...req.body,
          };
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            } else {
                // if photo not updated
                if (req.file == null) {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject })
                        .then(() =>
                            res.status(201).json({ message: 'Objet Modifié' })
                        )
                        .catch((error) => res.status(401).json({ error }));
                } else { // if photo updated
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            { ...sauceObject }
                        )
                            .then(() =>
                                res
                                    .status(201)
                                    .json({ message: 'Objet Modifié' })
                            )
                            .catch((error) => res.status(401).json({ error }));
                    });
                }
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

// delete sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'non autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: 'Sauce Suppprimée' })
                        )
                        .catch((error) => res.status(400).json({ error }));
                });
            }
        })
        .catch((error) => res.status(400).json({ error }));
};

//like/dislike sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.body.like === 1) {
                // like sauce
                sauce.likes++;
                sauce.usersLiked.push(req.body.userId);
                sauce
                    .save()
                    .then(() =>
                        res.status(201).json({ message: 'sauce likée' })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
            if (req.body.like === -1) {
                // dislike sauce
                sauce.dislikes++;
                sauce.usersDisliked.push(req.body.userId);
                sauce
                    .save()
                    .then(() =>
                        res.status(201).json({ message: 'Sauce dislikée' })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
            if (req.body.like === 0) {
                // modify vote
                const findUsersDisliked = sauce.usersDisliked.find(
                    (user) => (user = req.body.userId)
                );
                if (findUsersDisliked) {
                    sauce.dislikes--;
                    sauce.usersDisliked.splice(
                        sauce.usersLiked.indexOf(req.body.userId),
                        1
                    );
                    sauce
                        .save()
                        .then(() =>
                            res.status(201).json({ message: 'sauce délikée' })
                        )
                        .catch((error) =>
                            res
                                .status(401)
                                .json({ error, message: 'usersDisliked' })
                        );
                }

                const findUsersLiked = sauce.usersLiked.find(
                    (user) => (user = req.body.userId)
                );
                if (findUsersLiked) {
                    sauce.likes--;
                    sauce.usersLiked.splice(
                        sauce.usersLiked.indexOf(req.body.userId),
                        1
                    );
                    sauce
                        .save()
                        .then(() =>
                            res.status(201).json({ message: 'sauce délikée' })
                        )
                        .catch((error) =>
                            res
                                .status(401)
                                .json({ error, message: 'usersLiked' })
                        );
                }
            }
        })
        .then(() => console.log(req.body.like))
        .catch((error) => res.status(400).json({ error }));
};
