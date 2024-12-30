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

const allTestResult= [
{
    
        "id": 3,
        "idTestDescriptor": 3,
        "Date": "01/04/2022",
        "Result": "false"
    
}
]


describe('get /api/skuitems/:rfid/testResults', function() {
    it('Getting all testResults given rfid', function(done) {
        agent.get('/api/skuitems/6168483648673867/testResults')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allTestResult);
            done()
        }).catch(done);
    } )
})

const exTestResult ={
    "id": 2,
    "idTestDescriptor" : 2,
    "Date":"03/03/2022",
    "Result" : "true",
       
}
describe('get /api/skuitems/:rfid/testResults/:id', function() {
    it('Getting testResult given its rfid and id', function(done) {
        agent.get('/api/skuitems/6168483648673865/testResults/2')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.be.eql(exTestResult);
            done()
        }).catch(done);
    } )
})

const sendTestResult ={
    "rfid" : "6168483648673864",
    "idTestDescriptor": 5,
    "Date":"05/03/2022",
    "Result" : "true",
}

describe('post /api/skuitems/testResult', function() {
    it('Creating a new TestResult', function(done) {
        agent.post('/api/skuitems/testResult')
        .set('content-type', 'application/json')
        .send(sendTestResult)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putTestResult={
    "newidTestDescriptor":5,
    "newDate":"05/03/2022",
    "newResult": "false"
}

describe('put /api/skuitems/:rfid/testResult/:id', function() {
    it('Updating testResult', function(done) {
        agent.put('/api/skuitems/6168483648673864/testResult/5')
        .set('content-type', 'application/json')
        .send(putTestResult)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})


describe('delete /api/skuitems/:rfid/testResult/:id', function() {
    it('deleting testResult given its id and rfid', function(done) {
        agent.delete('/api/skuitems/6168483648673864/testResult/5',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})