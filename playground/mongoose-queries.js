const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '594b23d11b2e100124eb096311';
var id = '5949ebc774b08f0607a7c7b7';
//changing 1 number is still valid but adding extra characters makes it invalid

// if(!ObjectID.isValid(id)){
//     console.log('ID not valid');
// }


// Todo.find({
//     _id: id
// }).then( (todos) => {
//     console.log('Todos', todos)
// })

// Todo.findOne({  //find only the first one
//     _id: id
// }).then( (todo) => {
//     console.log('Todo.findOne: ', todo)
// })

// Todo.findById(id).then( (todo) => {
//     if(!todo){  //if id doesnt exist, result will be null
//         return console.log('id not found');
//     }
//     console.log('Todo.findById: ', todo)
// }).catch((err) => console.log('err:', err));

User.findById(id).then( (result)=>{
    if(!result){
        return console.log('not able to find user');
    };
    console.log('id found for ', JSON.stringify(result, undefined, 2));
}).catch((err) => console.log('error: ', err))