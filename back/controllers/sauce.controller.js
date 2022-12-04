const SauceModal = require('../models/sauce.model');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  //get Object from the request and parse it to JSON format
  const sauceObject = JSON.parse(req.body.sauce);
  //remove the _id from the request
  delete req.body._id;
  //create a new instance of SauceModal (model)
  const sauce = new SauceModal({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  //save the sauce in the database
  sauce.save()
    //if the sauce is saved, send a response with a status 201 (created)
    .then(() => res.status(201).json({message: 'Sauce created!'}))
    //if there is an error, send a response with a status 400 (bad request)
    .catch(error => res.status(400).json({error}))
}

/**
 * get all sauces from the database
 * if err snd a response with a status 400 (bad request)
 * if ok, return Object and send resp with a status 200 (ok)
 */
exports.getAllSauces = (req, res) => {
  SauceModal.find((err, sauces) => {
    if (err) {
      console.log(err);
      return res.status(400).json({err});
    }
    return res.status(200).json(sauces);
  })
}

/**
 * get one sauce from the database
 * with the id from the request
 */
exports.getOneSauce = (req, res) => {
  SauceModal.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}))
}

/**
 * @function update a sauce in the database
 * if req contains a file,
 * get file path and delete the old image from the server
 * get the new image path from REQ
 * update the sauce in the database
 * with the new data and the new image path
 * if req doesn't contain a file,
 * update the sauce in the database with the new data
 */
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
  if (sauceObject) {
    SauceModal.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        //remove the old image from the server
        fs.unlink(`images/${filename}`, () => {
          console.log(filename + ' removed')
        })
        const newPath = req.file.filename
        SauceModal.updateOne({_id: req.params.id}, {
          ...req.body,
          imageUrl: `${req.protocol}://${req.get('host')}/images/${newPath}`})
          .then(() => res.status(200).json({message: 'Sauce & img updated!'}))
          .catch(error => res.status(400).json({error}))
      })
  }
  else {
    SauceModal.updateOne({_id: req.params.id}, {...req.body})
      .then(() => res.status(200).json({message: 'Sauce updated!'}))
      .catch(error => res.status(400).json({error}))
  }
}

/**
 * @function delete a sauce from the database
 * find product by id
 * get the image path from the database for remove it from the server
 * remove image from the server and the sauce Object from the database
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
 * @like {Number}
 * //if like = 1, the user likes the sauce
 * //if like = 0, the user cancels his like or dislike
 * //if like = -1, the user doesn't like the sauce
 * //if user like or dislike the sauce, the id of the user must be added or removed from the appropriate array
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
            SauceModal.updateOne({_id: sauceId},
              {
                $inc: {likes: +1},
                $push: {usersLiked: userId},
                _id: sauceId
              })
              .then(() => res.status(200).json({message: 'Sauce liked!'}))
              .catch(error => res.status(400).json({error}))
            break
          case 0:
            if (sauce.usersLiked.includes(userId)) {
              SauceModal.updateOne({_id: sauceId},
                {
                  $inc: {likes: -1},
                  $pull: {usersLiked: userId},
                  _id: sauceId
                })
                .then(() => res.status(200).json({message: 'Sauce unliked!'}))
                .catch(error => res.status(400).json({error}))
            } else {
              SauceModal.updateOne({_id: sauceId}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}, _id: sauceId})
                .then(() => res.status(200).json({message: 'Sauce undisliked!'}))
                .catch(error => res.status(400).json({error}))
            }
            break
          case -1:
            if (!sauce.usersDisliked.includes(userId)) {
              SauceModal.updateOne({_id: sauceId},
                {
                  $inc: {dislikes: +1},
                  $push: {usersDisliked: userId},
                  _id: sauceId
                })
                .then(() => res.status(200).json({message: 'Sauce disliked!'}))
                .catch(error => res.status(400).json({error}))
              break
            }
        }

      } catch (e) {
        res.status(400).json({error: e})
      }
    })
}

