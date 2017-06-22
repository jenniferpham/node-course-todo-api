//EXTERNAL
var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//INTERNAL
var {mongoose} = require ('./db/mongoose'); //can leave of .js extension. creates a mongoose variable same as variable from the file required
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); //middleware we give to express

app.post('/todos', (request, response) => {
    var todo = new Todo({
        text: request.body.text
    });

    todo.save().then( (doc) => {  //setup sending response so it shows up in postman
        response.send(doc);
    }, (err) => {
        response.status(400).send(err);
    })
})

app.get('/todos', (req, res) => {
    Todo.find().then( (todos) => {
        res.send({todos}) //seding object is much more flexible
    }, (e) => {
        res.status(400).send(e)
    })
})

app.get('/todos/:id', (req, res)=>{
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

    Todo.findById(id).then( (result)=> {
        if(!result){ //it is a valid id but just not in our collection
            res.status(404).send({})
        }
        res.status(200).send({todo: result});
    }).catch((err) => {
        res.status(400).send({});  //this would happen when the id is not valid
    })
})

app.listen(port, () => {
    console.log('starting app on ', port)
})

module.exports = {
    app: app
}