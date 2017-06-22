var mongoose = require('mongoose');

mongoose.Promise = global.Promise; //use promises native to language
mongoose.connect(process.env.MONGODB_URI);

module.exports = {
    mongoose: mongoose
}