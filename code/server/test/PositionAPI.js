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


const allPosition= [{
    "positionID":"123412341234",
    "aisleID": "1234",
    "row": "1234",
    "col": "1234",
    "maxWeight": 100,
    "maxVolume": 100,
    "occupiedWeight": 10,
    "occupiedVolume":10
},
{
    "positionID":"111122223333",
    "aisleID": "1111",
    "row": "2222",
    "col": "3333",
    "maxWeight": 420,
    "maxVolume": 22,
    "occupiedWeight": 0,
    "occupiedVolume":0
}
]


describe('get /api/positions', function() {
    it('Getting all Position', function(done) {
        agent.get('/api/positions')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allPosition);
            done()
        }).catch(done);
    } )
})


const sendposition ={
    "positionID":"123412341235",
    "aisleID": "1234",
    "row": "1234",
    "col": "1235",
    "maxWeight": 100,
    "maxVolume": 100,
}

describe('post /api/position', function() {
    it('Creating a position', function(done) {
        agent.post('/api/position')
        .set('content-type', 'application/json')
        .send(sendposition)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putposition={
    "newAisleID": "1234",
    "newRow": "1234",
    "newCol": "1234",
    "newMaxWeight": 1200,
    "newMaxVolume": 600,
    "newOccupiedWeight": 200,
    "newOccupiedVolume":100
}

describe('put /api/position/:positionID', function() {
    it('Updating a  position', function(done) {
        agent.put('/api/position/"123412341235"')
        .set('content-type', 'application/json')
        .send(putposition)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})

const putpositionId={
    "newPositionID":"123412341236"
}
describe('put /api/position/:positionID/changeID', function() {
    it('Updating a  position id', function(done) {
        agent.put('/api/position/"123412341235"/changeID')
        .set('content-type', 'application/json')
        .send(putpositionId)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})
describe('delete /api/position/:id', function() {
    it('deleting a position ', function(done) {
        agent.delete('/api/item/"123412341235"',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})