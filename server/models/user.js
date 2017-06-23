const mongoose = require('mongoose');
const validator = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash';)

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true, 
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function(){  //what happens when mongo is converted to json value
    var user = this;
    var userObject = user.toObject(); // taking mongoose user and converting it to regular object

    return _.pick(userObject, ['_id', 'email']); //only return id and email of this userObject
};

UserSchema.methods.generateAuthToken = function(){  //usees this type of function b/c it binds to this keyword
    var user = this;
    var access = 'auth';
    var token = JWT.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({
        access: access,
        token: token
    });

    return user.save().then( () => {
        return token; //gives ou the token only after user is saved
    })
};

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
}