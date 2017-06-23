const {SHA256} = require('crypto-js');  //256 is # of bit
const jwt = require('jsonwebtoken');

// jwt.sign - creates the hash and returns the token value
// jwt.verify - makes sure data was not manipulated

var data = {
    id: 10
}

var token = jwt.sign(data, '123abc');
console.log(token);

var decoded = jwt.verify(token, '123abc'); //2nd argument is the secret. must be same as the token. only returns decoded value if it's the same secret. if not, it will throw an error.
console.log(decoded);



// var message = "I am user number 3";
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// //hashing is one way hash but cannot go the other way

// var data = { //this is insecure b/c someone can just change id and hash it and thne change someone else's data
//     id: 4
// };
// var token = {
//     data: data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString() //salt so that hacker can't just re-hash themselves and get the same value
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash){
//     console.log('Data was not changed. Trustworthy!');
// } else{
//     console.log('Data was changed. Do not trust!');
    
// }