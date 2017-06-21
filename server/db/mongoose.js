var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //use promises native to language
mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose: mongoose
}