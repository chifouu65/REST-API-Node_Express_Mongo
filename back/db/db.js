const mongoose = require('mongoose');
//pass/user => MongoDBP6
//CollectionName => data
//databaseName => db
 const db = () => {
    mongoose.connect('mongodb+srv://MongoDBP6:MongoDBP6@cluster.hmh197x.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => console.log('// Connected to MongoDB //'))
    .catch(err => console.log(err));
}

module.exports = db