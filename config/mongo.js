const mongoose = require('mongoose');

const mongoDB =  mongoose.connect('mongodb://localhost:27017/Luxora', function(req, res){
    console.log('Connected to MongoDB');
})

module.exports =  mongoDB;