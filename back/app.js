const express = require('express');
const app = express()
const db = require('./db')
const path = require('path');
const cors = require('cors');

//routes import
const authRouter = require('./routes/user')
const sauceRouter = require('./routes/sauce')
//MongoDB connection
db();
app.use(cors());
app.use(express.json());
app.use('/', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})
//routes
app.use("/api/auth", authRouter);
app.use("/api/sauces", sauceRouter);
app.use("/images", express.static(path.join(__dirname, "images")));
//middleware
const middleware = require('./middleware/middleware')
app.use(middleware.notFound);
app.use(middleware.errorHandler);

//if file images is not found in the server then it will be created
const fs = require('fs');
const dir = './images';
if (!fs.existsSync(dir)) {
  console.log('creating images folder');
  fs.mkdirSync(dir);
} else {
  console.log('images folder already exists');
}

module.exports = app;
