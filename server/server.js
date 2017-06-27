//DIFFERENT ENVIRONMENTS
var env = process.env.NODE_ENV || 'dev';  //heroku will automatically set process.env.node_env to "production". if it doesn't exist, it will be dev
console.log('env ****', env);

if(env === 'dev'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

//EXTERNAL
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

//INTERNAL
const {mongoose} = require ('./db/mongoose'); //can leave of .js extension. creates a mongoose variable same as variable from the file required
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //middleware we give to express


//post. Pass in Token to find User. Set _creator property to user._id. Then save.
app.post('/todos', authenticate, (request, response) => { //authenticate middleware
    var todo = new Todo({
        text: request.body.text,
        _creator: request.user._id
    });

    todo.save().then( (doc) => {  //setup sending response so it shows up in postman
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    })
})

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id //find all todos made by that creator
    }).then( (todos) => {
        res.send({todos}) //seding object is much more flexible
    }, (e) => {
        res.status(400).send(e)
    })
})

//get specific id and use authenticate to make sure it is a todo by the user that iloggged in
app.get('/todos/:id', authenticate, (req, res)=>{
    var id = req.params.id;
    //check if id is valid using isValid method. if not, give 404 and send back empty body
    //findById
        //success
            //if todo - send it back
            //if no todo - send back 404 with empty body
        //error
            //400 - and send empty body back
    if(!ObjectID.isValid(id)){
        return res.status(404).send({});
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then( (result)=> {
        if(!result){ //it is a valid id but just not in our collection
            res.status(404).send({})
        }
        res.status(200).send({todo: result});
    }).catch((err) => {
        res.status(400).send({});  //this would happen when the id is not valid
    })
})

app.delete('/todos/:id', authenticate, (req, res) => {
    //get the id

    //validate the id --> not valid? return 404. (it will still be successful if it doesn't remove but it just returns a null response)
    
    //remove todo by id
        //success
            //if no doc, send 404
            //if doc, send doc back with 200
        //error
            //400 with empty body

    var id = req.params.id;
    if (!ObjectID.isValid){  //if ID is not valid
        return res.status(404).send({});
    }

    Todo.findOneAndRemove({
        _id: id, 
        _creator: req.user._id}
    ).then( (result)=> {
        if(!result){
            return res.status(404).send({})
        } else{
            return res.status(200).send({todo: result})
        }

    }).catch( (err) => res.status(400).send({error: err})  )
})

app.patch('/todos/:id', authenticate, (req, res)=> {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //select which properties users can update/edit. don't want them updating program-generated IDs

    if(!ObjectID.isValid){
        return res.status(404).send({err: 'ID is not valid'});
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime(); //returns javascript milliseconds from 1970
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {$set: body}, {new: true} ).then( (todo)=>{
        if(!todo){
            return Promise.reject();
        }
        return res.status(200).send({todo})
    })
    .catch( (e) => {
        return res.status(400).send({error: e})
    })

    // Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (result)=> {
    //     if(!result){
    //         return res.status(404).send({error: 'dont see this id'})
    //     }
    //     return res.status(200).send({todo: result})
    // }).catch( (err) => {
    //     return res.status(400).send({err: err})
    // });
});

//POST Users - use pick for what they can edit
//add new user who gives an x-auth on response.headers
// app.post('/users', (req, res) => {

//     var body = _.pick(req.body, ['email', 'password']); //select which properties users can update/edit. don't want them updating program-generated IDs

//     //create new user
//     var user = new User(body);

//     //save new user (made from req.body onto db
//     user.save().then( () => {
//         // if(!result){
//         //     return res.status(404).send({err: 'did not post. no result returned'});
//         // }
//         // return res.status(200).send({user: result})

//         let token = user.generateAuthToken();
//         return token;
//     }).then( (token) => {
//         res.header('x-auth', token).status(200).send(user);  //create custom  header to store teh value
//     }).catch( (err)=> {
//         res.status(400).send(err)
//     })
//})

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    //   var shortenedUser = user.toJSON();
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

//Trying to get a new token
app.post('/users/login', (req, res) => {
    //pick email and pw to display
    var body = _.pick(req.body, ['email', 'password']);

//pass in email and password and get user back
    User.findByCredentials(body.email, body.password).then( (user) => {
        //take in user if email and password match, and output token
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).status(200).send(user);
        })
    }).catch( (e)=> {
        res.status(400).send({error: 'cannot login'})
    })
})

//LOGOUT - delete token out of tokens array
//private. use authenticate middleware
//req.header['x-auth'] gives the token in "authenticate" middleware
app.delete('/users/me/token', authenticate, (req, res) => {
    //ideally it will return a promise because we will have to respond to the user once token is deleted
    req.user.removeToken(req.token).then( ()=>{
        res.status(200).send();
    }, () => {
        res.status(400).send({});
    });
});

//make private route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.listen(port, () => {
    console.log('starting app on ', port)
})

module.exports = {
    app: app
}