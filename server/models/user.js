const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

    return _.pick(userObject, ['_id', 'email', 'password']); //only return id and email of this userObject
};

UserSchema.methods.generateAuthToken = function(){  //usees this type of function b/c it binds to this keyword. this is specific to a particular user.
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({
        access: access,
        token: token
    });

    return user.save().then( () => {
        return token; //gives ou the token only after user is saved
    })
};

//statics holds model methods. This searches across all the users to verify one.
UserSchema.statics.findByToken = function (token) {
    var User = this;  //this is model unlike other method which is instance method
    var decoded;
    
    try{  //any errors and it will go into catch block
        decoded = jwt.verify(token, 'abc123');
    } catch(e){
        // return new Promise( (resolve, reject)=> {
        //     reject();
        // })
        return Promise.reject();  //everything below will never fire
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,  //quotes are required when there is a dot in the value
        'tokens.access': 'auth'
    })
};

UserSchema.pre('save', function(next) {  //middleware. next() must be called at end or else program will crash. executes this function BEFORE it saeves to db. Mongo middleware allows us to run before or after we update database
    var user = this;

    if(user.isModified('password')){ //returns true if this document was modified. Want to encrypt password only if it was JUST modified. Don't want to hash your hash.

        bcrypt.genSalt(10, (err, salt) => { //# of rounds to generate salt (more takes longer but less chance of brute force), 2nd arg is callback
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash; //previously user.password was a plain text pw adn override this with hashed version
                 next(); //must be called or else your program will break
            });
        } ); 
       
    } else{
        next();
    }   

})

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
}