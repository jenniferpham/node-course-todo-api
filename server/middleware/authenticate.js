const {User} = require('./../models/user');

//This is Middleware.  Middleware has 3 arguments
//Changes the request...adds more things in the request.
var authenticate = (req, res, next) => { 
    var token = req.header('x-auth');  //getting the token from request.header x-auth

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject(); //this makes it error out and go to the catch block so you dont have to copy in the same code twice
        }
        req.user = user;
        req.token = token;
        next(); //must call next() so that this ends and the next thing executes
    }).catch( (e) => {
        res.status(401).send({error: 'dont try to hack me'}); //not calling next() because we don't want the next code inside of app.get('/users/me', ...) to execute if there is an error.
    })
}

module.exports = {authenticate};