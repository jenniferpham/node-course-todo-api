const {SHA256} = require('crypto-js');  //256 is # of bit
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

//hash and salt password before they are saved

bcrypt.genSalt(10, (err, salt) => { //# of rounds to generate salt (more takes longer but less chance of brute force), 2nd arg is callback
    bcrypt.hash(password, salt, (err, hash) => {
        // console.log(hash);
    });
} );  

var hashedPassword = '$2a$10$ZfrV9pN7c5dXWtTWUx7Ao.SUpnqJnKiyd.kt5jBT9W/rg6UG4ESca';

bcrypt.compare(password, hashedPassword, (err, result) =>{
    console.log(result);
});

// jwt.sign - creates the hash and returns the token value
// jwt.verify - makes sure data was not manipulated

// var data = {
//     id: 10
// }

// var token = jwt.sign(data, '123abc');
// console.log(token);

// var decoded = jwt.verify(token, '123abc'); //2nd argument is the secret. must be same as the token. only returns decoded value if it's the same secret. if not, it will throw an error.
// console.log(decoded);



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