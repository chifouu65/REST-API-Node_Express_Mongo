const UserModal = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = (req, res, next) => {
    //cryptage du mot de passe avec bcryp
    bcrypt.hash(req.body.password, 10)
        //get the hash
        .then(hash => {
            //create a new user with the email and password(HASH)
            // from the request
            const user = new UserModal({
                email: req.body.email,
                password: hash
            });
            //save the user in the database and send a response
            user.save()
                .then(() => res.status(201).json({message: 'User created!'}))
                /**
                 * error 400 is a bad request send by the client if the request
                 * is malformed or email already exists.
                 */
                .catch(error => res.status(400).json({error}));
        })
        //error 500 is a server error
        .catch(error => res.status(500).json({error}));
}

exports.login = (req, res, next) => {
    UserModal.findOne({email: req.body.email}, )
        .then(user => {
            if (!user) {
                //Utilisateur non trouvé !
                return res.status(401).json({error: 'Bad request'});
            }
            //compare the password from the request with the password from the database
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        //Mot de passe incorrect ! (error 401 is a unauthorized request)
                        return res.status(401).json({error: 'Bad request'});
                    }
                  /**
                   * si le mot de passe est correct
                   * on crée un token avec la fonction sign de jsonwebtoken
                   * et on renvoie l'utilisateur avec son id et son token au front-end.
                   * ----
                   * Ce qui permettra de l'authentifier sur les routes protégées
                   */
                  res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id},
                                    process.env.TOKEN,
                            {expiresIn: '15m'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
}

