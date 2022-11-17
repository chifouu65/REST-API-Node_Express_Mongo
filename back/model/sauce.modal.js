const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    manufacturer: {
        type: String,
        required: true,
        unique: true
    }
    description: {
        type: String,
        required: true,
        unique: true
    },
    mainPepper: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true,
        unique: true
    },
    heat: {
        type: Number,
        required: true,
        unique: true
    },
    likes: {
        type: Number,
        required: true,
        unique: true
    },
    dislikes: {
        type: Number,
        required: true,
        unique: true
    },
    usersLiked: {
        type: [String],
        required: true,
        unique: true
    },
    usersDisliked: {
        type: [String],
        required: true,
        unique: true
    },
})

module.exports = mongoose.model('Sauce', sauceSchema);

