//CONNECT TO DATABASE

//look for Mongo client
//const MongoClient = require('mongodb').MongoClient;
//const {MongoClient} = require('mongodb'); //this is identical to code up above
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {  //if first argument database doesnt exist, it will create that database when you start adding stuff in. You can connect to a database that doesnt exist successfully (weird)
    if(err){
        return console.log('Unable to connect to MongoDB server');  //use 'return' to stop the function prematurely
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5949e2121b2e100124eb093c') //filtering to what you want to update
    // },
    // {
    //     $set: {
    //         completed: true
    //     }
    // },
    // {
    //     returnOriginal: false //you want the updated one, not the original one
    // }
    // ).then( (result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndUpdate( //arguments (filter, update, options)
    {
        _id: new ObjectID('5949e2d71b2e100124eb0945')   
    },
    {
        $set: {
            name: 'Leo Awesome'
        },
        $inc: {
            age: 10
        }
    },
    {
        returnOriginal: false //I want it to return the updated version, not the original
    }

    ).then( (result) => {
        console.log(result);
    })
    
}); //first arg is where data lives, 2nd arg is callback function that handles when it succeeds or fails