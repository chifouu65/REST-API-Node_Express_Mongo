const mongoose = require('mongoose')
const uniqueEmail = require('mongoose-unique-validator')
//unique: true = une seul email mais pas tres fialble
//better to add mongoose-unique-validator package
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

userSchema.plugin(uniqueEmail)

module.exports = mongoose.model('User', userSchema);