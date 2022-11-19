const SauceModal = require('../model/sauce.model');
const fs = require('fs');
exports.createSauce = async (req, res, next) => {
  //create a new sauce with the data from the request
  //parse the stringified data from the request
  const sauceObject = await JSON.parse(req.body.sauce);
  //delete the id from the request
  delete await sauceObject._id;
  /**https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/
   * Le point important ici est que notre type
   * de données pour l'image est un Buffer qui nous
   * permet de stocker notre image comme des données sous forme de tableaux.
   */
  const sauce = await new SauceModal({
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
    if (err) {
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
  const sauceObject = req.file
  //if the request contains a file
  if (sauceObject) {
    SauceModal.findOne({_id: req.params.id})
      .then(sauce => {
        //PATH DE BASE
        const filename = sauce.imageUrl.split('/images/')[1];
        console.log('filename', filename);
        fs.unlink(`images/${filename}`, () => {
          console.log(`image: ${filename} deleted`);
        })
        //PATH DE LA NEW IMG
        const newPath = req.file.filename
        //remove the old image in the folder images from the server
        SauceModal.updateOne({_id: req.params.id}, {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${newPath}`
        })
          .then(() => res.status(200).json({message: 'Sauce & img updated!'}))
          .catch(error => res.status(400).json({error}))
      })
  } else {
    //if the request doesn't contain a file
    SauceModal.updateOne({_id: req.params.id}, {...req.body})
      .then(() => res.status(200).json({message: 'Sauce updated!'}))
      .catch(error => res.status(400).json({error}))
  }

}

exports.deleteSauce = (req, res, next) => {
  SauceModal.findOne({_id: req.params.id})
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        SauceModal.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({message: 'Sauce deleted!'}))
          .catch(error => res.status(400).json({error}))
      })
    })
    .catch(error => res.status(500).json({error}))
}
/**Définit le statut « Like » pour
 l' userId fourni.
 Si like = 1,l'utilisateur aime (= like) lasauce.
 Si like = 0, l'utilisateur annule son like ou son dislike.
 Si like = -1, l'utilisateur n'aime pas (= dislike) la sauce. L'ID de l'utilisateur doit être ajouté ou retiré du tableau approprié.

 Cela permet de garder une trace de leurs préférences et les empêche
 de liker ou de ne pas disliker la même sauce plusieurs fois : un utilisateur ne peut
 avoir qu'une seule valeur
 pour chaque sauce. Le
 nombre total de « Like » et
 de « Dislike » est mis à jour à
 chaque nouvelle notation.
 */

/**
 * @param {Object}
 * @like {Number}
 * //if like = 1, the user likes the sauce
 * //if like = 0, the user cancels his like or dislike
 * //if like = -1, the user doesn't like the sauce
 * //if user like or dislike the sauce, the id of the user must be added or removed from the appropriate array
 * @param req
 * @param res
 * @param next
 */
exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  SauceModal.findOne({_id: sauceId})

    .then(sauce => {
      /**      if (like === 1) {
        SauceModal.updateOne({_id: sauceId}, {
            $inc: {likes: +1},
            $push: {usersLiked: userId},
            _id: sauceId
          }
        ).then(() => res.status(200).json({message: 'Sauce liked!'}))
          .catch(error => res.status(400).json({error}))
      } else if (like === -1) {
        SauceModal.updateOne({_id: sauceId}, {
            $inc: {dislikes: +1},
            $push: {usersDisliked: userId},
            _id: sauceId
          }
        ).then(() => res.status(200).json({message: 'Sauce disliked!'}))
          .catch(error => res.status(400).json({error}))
      } else {
        SauceModal.updateOne({_id: sauceId}, {
            likes: -1,
            $pull: {usersDisliked: userId},
            _id: sauceId
        })
      } */
      try {
        switch (like) {
          case 1:
            SauceModal.updateOne({_id: sauceId}, {$inc: {likes: +1}, $push: {usersLiked: userId}, _id: sauceId})
              .then(() => res.status(200).json({message: 'Sauce liked!'}))
              .catch(error => res.status(400).json({error}))
            break
          case 0:
            if (sauce.usersLiked.includes(userId)) {
              SauceModal.updateOne({_id: sauceId}, {$inc: {likes: -1}, $pull: {usersLiked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Sauce unliked!'}))
                .catch(error => res.status(400).json({error}))
            }
            break
          case -1:
            SauceModal.updateOne({_id: sauceId}, {$inc: {dislikes: +1}, $push: {usersDisliked: userId}, _id: sauceId})
              .then(() => res.status(200).json({message: 'Sauce disliked!'}))
              .catch(error => res.status(400).json({error}))
            break
        }
      } catch (e) {
        console.log(e)
      }
    })
}
