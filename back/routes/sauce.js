
const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce.controller');
const authentication = require('../middleware/authentification');
const multer = require('../middleware/multer');
/** -- Middleware --
 * Multer :
 * middleware qui permet de gérer les fichiers entrants dans les req HTTP
 * et de les stocker sur le disque dur du serveur.
 *
 * authentification :
 * middleware qui permet de vérifier que l'utilisateur est celui qu'il prétend être
 * avant de pouvoir accéder aux routes de l'API.
 */
router.post('/', authentication, multer, sauceController.createSauce);
router.get('/', authentication, sauceController.getAllSauces);
router.get('/:id', authentication, sauceController.getOneSauce);
router.put('/:id', authentication, multer, sauceController.modifySauce);
router.delete('/:id', authentication, sauceController.deleteSauce);
router.post('/:id/like', authentication, sauceController.likeSauce);

module.exports = router;
