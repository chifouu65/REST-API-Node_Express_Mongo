
const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');
const authentication = require('../middleware/authentification');
const multer = require('../middleware/multer');

router.post('/', authentication, multer, sauceController.createSauce);
router.get('/', authentication, sauceController.getAllSauces);
router.get('/:id', authentication, sauceController.getOneSauce);
router.put('/:id', authentication, multer, sauceController.modifySauce);
router.delete('/:id', authentication, sauceController.deleteSauce);
router.post('/:id/like', authentication, sauceController.likeSauce);

module.exports = router;
