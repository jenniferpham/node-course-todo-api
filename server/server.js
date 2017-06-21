//EXTERNAL
var express = require('express');
var bodyParser = require('body-parser');

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

app.listen(port, () => {
    console.log('starting app on ', port)
})