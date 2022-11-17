const express = require('express');
const app = express()
const db = require('./db')
//routes import
const authRouter = require('./routes/user')
const sauceRouter = require('./routes/sauce')
//MongoDB connection
db();
//middleware
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

module.exports = app;