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

const allItems= [{
    "id": 1,
    "description":"Apple iPhone 18",
    "SKUId" : 1,
    "supplierId" :18,
    "price": 1290
},
{
    "id": 2,
    "description":"Samsung galaxy s21",
    "SKUId" : 2,
    "supplierId" :10,
    "price": 1000
},
{
    "id": 3,
    "description":"Logitech mx master 3",
    "SKUId" : 3,
    "supplierId" :18,
    "price": 0
}
]

describe('get /api/items', function() {
    it('Getting all items', function(done) {
        agent.get('/api/items')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allItems);
            done()
        }).catch(done);
    } )
})

const exitem ={
    "id": 1,
    "description":"Apple iPhone 18",
    "SKUId" : 1,
    "supplierId" :18,
    "price": 1290
}
describe('get /api/items/:id/:supplierId', function() {
    it('Getting a item given its id', function(done) {
        agent.get('/api/items/1/18')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.eql(exitem);
            done()
        }).catch(done);
    } )
})

const senditem ={
    "id": 4,
    "description":"HP Pavillion",
    "SKUId" : 4,
    "supplierId" :18,
    "price": 960
}

describe('post /api/item', function() {
    it('Creating an item', function(done) {
        agent.post('/api/item')
        .set('content-type', 'application/json')
        .send(senditem)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putitem={
    "newDescription" : "HP Somethingelse",
    "newPrice" : 1000.99
}

describe('put /api/item/:id/:supplierId', function() {
    it('Updating an item', function(done) {
        agent.put('/api/item/4/18')
        .set('content-type', 'application/json')
        .send(putitem)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})


describe('delete /api/items/:id/:supplierId', function() {
    it('deleting an item ', function(done) {
        agent.delete('/api/items/4/18',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})