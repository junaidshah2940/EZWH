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

const allSKUitem= [{
    "RFID": "6168483648673864",
    "Availability": 1,
    "DateOfStock" : "18/06/2020",
    "SKUId" :  1 
},
{
    "RFID": "6168483648673865",
    "Availability": 1,
    "DateOfStock" : "19/02/2020",
    "SKUId" :  1 
},
{
    "RFID": "6168483648673866",
    "Availability": 1,
    "DateOfStock" : "25/06/1845",
    "SKUId" :  2
},
{
    "RFID": "6168483648673867",
    "Availability": 1,
    "DateOfStock" : "25/06/2000",
    "SKUId" :  3
},
{
    "RFID": "6168483648673868",
    "Availability": 1,
    "DateOfStock" : "22/01/2021",
    "SKUId" :  3 
},
{
    "RFID": "12345678901234567890123456789016",
    "Availability": 1,
    "DateOfStock" : null,
    "SKUId" :  1 
},
{
    "RFID": "12345678901234567890123456789038",
    "Availability": 1,
    "DateOfStock" : null,
    "SKUId" :  1 
},
{
    "RFID": "12345678901234567890123456789018",
    "Availability": 1,
    "DateOfStock" : null,
    "SKUId" :  12 
},
{
    "RFID": "12345678901234567890123456789019",
    "Availability": 1,
    "DateOfStock" : null,
    "SKUId" :  12 
}
]


describe('get /api/skuitems', function() {
    it('Getting all SKUitem', function(done) {
        agent.get('/api/skuitems')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allSKUitem);
            done()
        }).catch(done);
    } )
})

const exskuitem ={
    "RFID": "6168483648673864",
    "Availability": 1,
    "DateOfStock" : "18/06/2020",
    "SKUId" :  1 
}
describe('get /api/skuitems/:id', function() {
    it('Getting a skuitem given its id', function(done) {
        agent.get('/api/skuitems/"6168483648673864"')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.eql(exskuitem);
            done()
        }).catch(done);
    } )
})

const skuitems=[{
    "RFID": "6168483648673867",
    "Availability": 1,
    "DateOfStock" : "25/06/2000",
    "SKUId" :  3
},
{
    "RFID": "6168483648673868",
    "Availability": 1,
    "DateOfStock" : "22/01/2021",
    "SKUId" :  3 
}]
describe('get /api/skuitems/sku/:id', function() {
    it('Getting list of skuitems given their skuid', function(done) {
        agent.get('/api/skuitems/3')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.eql(skuitems);
            done()
        }).catch(done);
    } )
})

const sendskuitem ={
    "RFID": "12345678901234567890123456789099",
    "DateOfStock" : "18/06/2020",
    "SKUId" :  1 
}

describe('post /api/skuitem', function() {
    it('Creating an skuitem', function(done) {
        agent.post('/api/skuitem')
        .set('content-type', 'application/json')
        .send(sendskuitem)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})



const putskuitem={   
        "newRFID":"12345678901234567890123456789099",
        "newAvailable":1,
        "newDateOfStock":"2021/11/29 12:30"
}

describe('put /api/skuitems/:id', function() {
    it('Updating an skuitem', function(done) {
        agent.put('/api/skuitems/"12345678901234567890123456789099"')
        .set('content-type', 'application/json')
        .send(putskuitem)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})


describe('delete /api/skuitems/:id', function() {
    it('deleting a skuitem given its id', function(done) {
        agent.delete('/api/skuitems/"12345678901234567890123456789099"',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})