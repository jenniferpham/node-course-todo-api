const {User} = require('./../models/user');

var authenticate = (req, res, next) => { //middleware has 3 arguments
    var token = req.header('x-auth');  //getting the token from request.header x-auth

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject(); //this makes it error out and go to the catch block so you dont have to copy in the same code twice
        }
        req.user = user;
        req.token = token;
        next();
    }).catch( (e) => {
        res.status(401).send({error: 'dont try to hack me'})
    })
}

module.exports = {authenticate};