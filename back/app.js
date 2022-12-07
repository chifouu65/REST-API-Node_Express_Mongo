const express = require('express');
const app = express()
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const authRouter = require('./routes/user')
const sauceRouter = require('./routes/sauce')
//MongoDB
const db = require('./db')
db();
/**
 * Middleware
 * Cors
 *     - Permet d'accéder à l'API depuis n'importe quelle origine
 *     - Permet d'ajouter des headers aux requêtes envoyées vers l'API
 *     - Permet d'envoyer des requêtes
 * express.json : permet de parser le corps des
 * requêtes reçues et de les rendre accessibles dans req.body
 */
app.use(cors());
app.use(express.json());
/**
 *  Cors config
 *  authorisation les req de type : GET POST PUT DELETE
 */
app.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
})
/**
 * Routes
 * - authRouter : authentification
 * - sauceRouter : CRUD sauces
 * - images : upload
 */
app.use("/api/auth", authRouter);
app.use("/api/sauces", sauceRouter);
app.use("/images", express.static(path.join(__dirname, "images")));

//if file 'images' is not found in the server
// then it will be created
const dir = './images';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

module.exports = app;
