//EXTERNAL
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//INTERNAL
const {mongoose} = require ('./db/mongoose'); //can leave of .js extension. creates a mongoose variable same as variable from the file required
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

app.delete('/todos/:id', (req, res) => {
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

    Todo.findOneAndRemove({_id: id}).then( (result)=> {
        if(!result){
            return res.status(404).send({})
        } else{
            return res.status(200).send({todo: result})
        }

    }).catch( (err) => res.status(400).send({error: err})  )
})

app.patch('/todos/:id', (req, res)=> {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then( (result)=> {
        if(!result){
            return res.status(404).send({error: 'dont see this id'})
        }
        return res.status(200).send({todo: result})
    }).catch( (err) => {
        return res.status(400).send({err: err})
    });
});

app.listen(port, () => {
    console.log('starting app on ', port)
})

module.exports = {
    app: app
}