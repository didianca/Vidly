const winston = require('winston');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

module.exports=function () {
    mongoose.connect('mongodb://localhost/vidly', {useNewUrlParser: true})
        .then(() => winston.info('Connected to MongoDB...'))
};