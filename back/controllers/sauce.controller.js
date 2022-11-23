const SauceModal = require('../model/sauce.model');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  //create a new sauce with the data from the request
  //parse the stringified data from the request
  const sauceObject = JSON.parse(req.body.sauce);
  //delete the id from the request
  delete sauceObject._id;
  const sauce = new SauceModal({
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
        fs.unlink(`images/${filename}`, () => {
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

/**
 * if product is removed, the image must be removed from the server
 * @param req
 * @param res
 * @param next
 */
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
            } else {
              SauceModal.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Sauce undisliked!'}))
                .catch(error => res.status(400).json({error}))
            }
            break
          case -1:
            if(!sauce.usersDisliked.includes(userId)){
              SauceModal.updateOne({_id: sauceId}, {$inc: {dislikes: +1}, $push: {usersDisliked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Sauce disliked!'}))
                .catch(error => res.status(400).json({error}))
              break
            } else {
              console.log('already disliked');
              break
            }
        }
      } catch (e) {
        res.status(400).json({error: e})
      }
    })
}

