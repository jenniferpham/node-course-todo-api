//DIFFERENT ENVIRONMENTS
//usually want to gitignore this environment
var env = process.env.NODE_ENV || 'dev';  //heroku will automatically set process.env.node_env to "production". if it doesn't exist, it will be dev

if(env === 'dev' || env === 'test'){
    var config = require('./config.json'); //require automaticallyl parses json file into json object
    var envConfig = config[env]; //grabs either "test" or "dev" object in json file

    Object.keys(envConfig).forEach( (key) => {
        process.env[key] = envConfig[key];  //set process.env.PORT and process.env.MONGODB_URI and secret too
    }); //takes all keys in object and returns it as an array
    
}
// console.log('env ****', env);


//BEFORE CODE - NOW REFACTORED TO ABOVE
// if(env === 'dev'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }