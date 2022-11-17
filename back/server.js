const db = require('./db/db')
const express = require("express")
const app = express();

//connection to database.
db()
//middleware
app.use(express.json())

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
})

/**ROUTES
//POST

app.post('/api/auth/signup', (req, res) => {
    res.status(200).json({message: 'signup post'})
})
app.post('/api/auth/login', (req, res) => {
    res.status(200).json({message: 'Login post'})
})
app.post('/api/sauces', (req, res) => {
    res.status(200).json({message: 'sauce post'})
})
//POST (LIKE)
app.post('api/sauces/:id/like', (req, res) => {
    res.status(200).json({message: 'Like post'})
})
//GET
app.get('api/sauces', (req, res) => {
    res.status(200).json({message: 'sauces get'})
})
app.get('api/sauces/:id', (req, res) => {
    res.status(200).json({message: 'sauce get'})
})
//PUT
app.put('api/sauces/:id', (req, res) => {
    res.status(200).json({message: 'sauce put'})
})
//DELETE
app.delete('api/sauces/:id', (req, res) => {
    res.status(200).json({message: 'sauce delete'})
})
app.get('/', (req, res) => {
    res.json({message: 'text'})
})
 */
app.listen(3000, () => {
    console.log("server is rtunning in port 3000")
})



