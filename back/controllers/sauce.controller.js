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

exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  const sauceId = req.params.id;
  SauceModal.findOne({_id: sauceId})
    .then(sauce => {
      sauce.save().then(r => {
        console.log(('product saved'))
      })
    })
    .catch(error => res.status(500).json({error}))

}
