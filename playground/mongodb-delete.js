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

    //**DELETE METHODS
    //deleteMany
    //deleteOne
    //findOneAndDelete

    // db.collection('Todos').deleteMany({text: 'Walk Holly and Bon Bon'}).then( (result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'Feed me'}).then( (result) => {
    //     console.log(result);
    // })

    // db.collection('Todos').findOneAndDelete({completed: true}).then( (result) => {
    //     console.log(result);
    // })

    //delete all users named Jennifer
    db.collection('Users').deleteMany({name: 'Jennifer'}).then( (result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5949d9ec1b2e100124eb0924')}).then( (data) => {
        console.log(data)
    })



    //findOneAndDelete user Jon by object id

    
    
}); //first arg is where data lives, 2nd arg is callback function that handles when it succeeds or fails