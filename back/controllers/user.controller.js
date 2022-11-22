const UserModal = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.signup = (req, res, next) => {
    //cryptage du mot de passe avec bcrypt et salage de 10 tours (plus le chiffre est élevé, plus le temps de cryptage est long)
    bcrypt.hash(req.body.password, 10)
        //get the hash
        .then(hash => {
            //create a new user with the email and password(HASH) from the request
            const user = new UserModal({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'User created!'}))
                /**
                 * error 400 is a bad request send by the client if the request is malformed or email already exists
                 * for security is better to don't send to client the information of email is already in use
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
                //Utilisateur non trouvé ! (error 401 is a unauthorized request)
                return res.status(401).json({error: 'Bad request'});
            }
            //compare the password from the request with the password from the database
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        //Mot de passe incorrect ! (error 401 is a unauthorized request)
                        return res.status(401).json({error: 'Bad request'});
                    }
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

exports.getAllUsers = (req, res, next) => {
    UserModal.find()
        .then(users => res.status(200).json(users))
        .catch(error => res.status(400).json({error}));
}
