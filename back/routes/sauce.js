
const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');
const authentification = require('../middleware/authentification');
const multer = require('../middleware/multer');

router.post('/', authentification, multer, sauceController.createSauce);
router.get('/', authentification, sauceController.getAllSauces);
router.get('/:id', authentification, sauceController.getOneSauce);
router.put('/:id', authentification, multer, sauceController.modifySauce);
router.delete('/:id', authentification, sauceController.deleteSauce);
router.post('/:id/like', authentification, sauceController.likeSauce);

module.exports = router;
