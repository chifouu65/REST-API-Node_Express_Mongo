const SauceModal = require('../model/sauce.model');

exports.createSauce = async (req, res, next) => {
    //create a new sauce with the data from the request
    //parse the stringified data from the request
    const sauceObject = await JSON.parse(req.body.sauce);
    //delete the id from the request
    delete await sauceObject._id;
    /**
     * Le point important ici est que notre type
     * de données pour l'image est un Buffer qui nous
     * permet de stocker notre image comme des données sous forme de tableaux.
     */
    const  sauce = await new SauceModal({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce created!'}))
        .catch(error => res.status(400).json({error}))
}
exports.getAllSauces = (req, res, next) => {
    SauceModal.find({}, (err, sauces) => {
        if(err) {
            console.log(err);
            return res.status(400).json({err});
        }
        return res.status(200).json(sauces);
    })
}
exports.getOneSauce = (req, res, next) => {
    SauceModal.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}))
}
exports.modifySauce = (req, res, next) => {

}

exports.deleteSauce = (req, res, next) => {

}

exports.likeSauce = (req, res, next) => {

}

