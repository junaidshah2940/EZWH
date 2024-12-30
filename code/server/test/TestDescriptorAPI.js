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

const allTestDescriptor= [
    {
        "id": 1,
        "name": "test1",
        "procedureDescription": "spegni e riaccendi",
        "SKUid": 1
    },
    {
        "id": 2,
        "name": "test2",
        "procedureDescription": "uguale a prima",
        "SKUid": 1
    },
    {
        "id": 3,
        "name": "test3",
        "procedureDescription": "stacca e riattacca",
        "SKUid": 2
    },
    {
        "id": 4,
        "name": "test4",
        "procedureDescription": "stacca stacca",
        "SKUid": 3
    }
    
]


describe('get /api/testDescriptors', function() {
    it('Getting all testDescriptors', function(done) {
        agent.get('/api/testDescriptors')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allTestDescriptor);
            done()
        }).catch(done);
    } )
})

const exTestDescriptor ={
    "id": 4,
    "procedureDescription":"stacca stacca",
    "name" : "test4",
    "SKUid" : 3 
}
describe('get /api/testDescriptors/:id', function() {
    it('Getting testDescriptor given its id', function(done) {
        agent.get('/api/testDescriptors/4')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.eql(exTestDescriptor);
            done()
        }).catch(done);
    } )
})

const sendTestDescriptor ={
    "id": 5,
    "procedureDescription":"Monolocale",
    "name" : "test5",
    "SKUid" : 2 
}

describe('post /api/testDescriptor', function() {
    it('Creating a new TestDescriptor', function(done) {
        agent.post('/api/testDescriptor')
        .set('content-type', 'application/json')
        .send(sendTestDescriptor)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putTestDescriptor={
    "newName" : "test5",
    "newProceduteDescription" : "Updated Monolocale",
    "newSKUid" : 2 
}

describe('put /api/testDescriptor/:id', function() {
    it('Updating testDescriptor', function(done) {
        agent.put('/api/testDescriptor/5')
        .set('content-type', 'application/json')
        .send(putTestDescriptor)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})


describe('delete /api/testDescriptor/:id', function() {
    it('deleting testDescriptor given its id', function(done) {
        agent.delete('/api/testDescriptor/5',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})