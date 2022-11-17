const SauceModal = require('../model/sauce.model');


exports.createSauce = (req, res, next) => {
    const sauce = JSON.parse(req.body.sauce);
    delete sauce._id;
    const sauceObject = new SauceModal({
        ...sauce,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0, // Initialise le nombre de likes à 0
        dislikes: 0, // Initialise le nombre de dislikes à 0
        usersLiked: [], // Crée un array qui contiendra le nom des utilisateurs ayant like.
        usersDisliked: [] // Crée un array qui contiendra le nom des utilisateurs ayant dislike.
    })
    sauceObject.save()
        .then(() => res.status(201).json({message: 'Sauce created!'}))
        .catch(error => res.status(400).json({ error }));
}
exports.getAllSauces = (req, res, next) => {
    SauceModal.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
}
exports.getOneSauce = (req, res, next) => {

}
exports.modifySauce = (req, res, next) => {

}

exports.deleteSauce = (req, res, next) => {

}

exports.likeSauce = (req, res, next) => {

}

