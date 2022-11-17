const express = require('express')
const router = express.Router();
const sauceController = require('../controller/SauceController')

router.post('/', sauceController.createSauce)
router.get('/', sauceController.getAllSauces)
router.get('/:id', sauceController.getOneSauce)
router.put('/:id', sauceController.modifySauce)
router.delete('/:id', sauceController.deleteSauce)

module.exports = router;