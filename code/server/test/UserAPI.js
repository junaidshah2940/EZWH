const chai = require ('chai');
const chaiHttp = require ('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});

const exsupp= {
    id : 2,    
    email:"gabriele@email.it",
    name:"Gabriele",
    surname : "Sambin",
    password : "999",
}
const exuser ={
    id : 2,    
    email:"gabriele@email.it",
    name:"Gabriele",
    surname : "Sambin",
    password : "999",
    type : "supplier"
}

describe('get /api/users', function() {
    it('Getting all Users', function(done) {
        agent.get('/api/users')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(exuser);
            done()
        }).catch(done);
    } )
})


describe('get /api/suppliers', function() {
    it('Getting suppliers', function(done) {
        agent.get('/api/suppliers')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.have.length(1)
            res.body.should.be.eql(exsupp);
            done()
        }).catch(done);
    } )
})

const senduser ={
    "username":"user1@ezwh.com",
    "name":"John",
    "surname" : "Smith",
    "password" : "testpassword",
    "type" : "customer"
}

describe('post /api/newUser', function() {
    it('Creating a user', function(done) {
        agent.post('/api/user')
        .set('content-type', 'application/json')
        .send(senduser)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putitem={
    "oldType" : "customer",
    "newType" : "clerk"
}

describe('put /api/users/:username', function() {
    it('Updating a user', function(done) {
        agent.put('/api/item/"user1@ezwh.com"')
        .set('content-type', 'application/json')
        .send(putitem)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})


describe('/api/users/:username/:type', function() {
    it('deleting a user ', function(done) {
        agent.delete('/api/users/"user1@ezwh.com"/"clerk"',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})