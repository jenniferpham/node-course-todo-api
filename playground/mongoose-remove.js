const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => console.log(result));

//Both of these methods get doc back
// Todo.findOneAndRemove
// Todo.findByIdAndRemove

Todo.findOneAndRemove({_id: '594b33e43e24498b146d1524'}).then( (result)=>{
    console.log(result);
}), (err) => {
    console.log('err', err);
}


// Todo.findByIdAndRemove('594b33eb3e24498b146d1526').then((todo) => {
//     console.log(todo)
// }, (err) => {
//     console.log('err', err);
    
// })