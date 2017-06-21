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

    // db.collection('Todos').find( {completed: false} ).toArray().then( (docs) => { //db.collection('XX').find() returns mongo db cursor/pointer to documents that has ton of methods to get documents
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('unable to fetch todos', err)
    // }); 

    // db.collection('Todos').find( {
    //         _id: new ObjectID('5949d45f1b2e100124eb091a')  //needs to create objectId that is imported on top
    //     } ).toArray().then( (docs) => { //db.collection('XX').find() returns mongo db cursor/pointer to documents that has ton of methods to get documents
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, (err) => {
    //         console.log('unable to fetch todos', err)
    //     }); 

        // db.collection('Todos').find().count().then( (count) => {
        //     console.log(`Todos count ${count}`);
        // }, (err) => {
        //     console.log('unable to fetch todos', err);
        // });

        db.collection('Users').find( {name: 'Jennifer'} ).count().then( (count) => {
            console.log(`There are ${count} users named "Jennifer"`);
        }, (err) => {
            console.log('unable to get "Jennifer"', err);
        });

        db.collection('Users').find( {name: 'Jennifer'} ).toArray().then( (docs) => {
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('unable to get "Jennifer"', err);
        });
    
}); //first arg is where data lives, 2nd arg is callback function that handles when it succeeds or fails