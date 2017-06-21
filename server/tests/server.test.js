const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');  //dont need .js extension
const {Todo} = require('./../models/todo');

beforeEach( (done) => {  //beforeEach runs before every test. database will be empty before every request
    //only moves onto test case after it's done. can do something asyncrhonously
    Todo.remove( {} ).then( () => done() )  //wipe out all of our objects and then call done, meaning our database will be empty before every request
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect( (res) => {
                expect(res.body.text);
            })
            .end( (err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch( (error) =>  done(error) )
            })
    })

    //2nd test
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos') 
            .send({})
            .expect(400) //b/c error in saving the object gets 400 error as stated in server.js
            .end( (err, res) => {
                if(err){
                    return done(err);
                }

                Todo.find().then( (todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch( (e) => done(e) );
            }
            
            )
    })
});
