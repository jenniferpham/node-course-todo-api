//CONNECT TO DATABASE

//look for Mongo client
//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); //this is identical to code up above
const {MongoClient, ObjectID} = require('mongodb');


//create new object id
var obj = new ObjectID();
console.log(obj);

//DESTRUCTURING Example
// var user = {name: 'andrew', age: 25};
// var {name} = user;  //create a new variable from a property of an object --> destructuring (ES6 property)
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {  //if first argument database doesnt exist, it will create that database when you start adding stuff in. You can connect to a database that doesnt exist successfully (weird)
    if(err){
        return console.log('Unable to connect to MongoDB server');  //use 'return' to stop the function prematurely
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
        
    // });

    //Insert new doc into Users collection (name, age, location)
    // db.collection('Users').insertOne({  //insert object into Users collection
    //     name: "Jennifer",
    //     age: 29,
    //     location: 'Anaheim'
    // }, (err, result) => {  //callback once its done
    //     if(err){
    //         return console.log('unable to add user', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // })
    

    db.close();
}); //first arg is where data lives, 2nd arg is callback function that handles when it succeeds or fails