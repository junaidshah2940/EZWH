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

const allSKUs= [{
    "id": 1,
    "description":"Apple iPhone 13",
    "weight" : 1,
    "volume": 1,
    "notes" : "che schifo",
    "positionId": 1,
    "availableQuantity": 2,
    "price": 1290,
    "testDescriptorId": 1
},
{
    "id": 2,
    "description":"Samsung galaxy s21+",
    "weight" : 2.5,
    "volume": 2.5,
    "notes" : "direi un po' meglio",
    "positionId": 2,
    "availableQuantity": 1,
    "price": 1000,
    "testDescriptorId": 2
},
{
    "id": 3,
    "description":"logitech mx master 3",
    "weight" : 55,
    "volume": 0.8,
    "notes" : null,
    "positionId": 3,
    "availableQuantity": 4,
    "price": 89,
    "testDescriptorId": 3
}
]


describe('get /api/skus', function() {
    it('Getting all SKUs', function(done) {
        agent.get('/api/skus')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allSKUs);
            done()
        }).catch(done);
    } )
})

const exSKU ={
    "id": 1,
    "description":"Apple iPhone 13",
    "weight" : 1,
    "volume": 1,
    "notes" : "che schifo",
    "positionId": 1,
    "availableQuantity": 2,
    "price": 1290,
    "testDescriptorId": 1
}
describe('get /api/skus/:id', function() {
    it('Getting a SKU given its id', function(done) {
        agent.get('/api/sku/1')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.eql(exSKU);
            done()
        }).catch(done);
    } )
})

const sendSKU ={
    "id": 4,
    "description":"HP Pavillion",
    "weight" : 1,
    "volume": 1,
    "notes" : "non male",
    "positionId": 4,
    "availableQuantity": 2,
    "price": 860,
    "testDescriptorId": 1
}

describe('post /api/sku', function() {
    it('Creating an SKU', function(done) {
        agent.post('/api/sku')
        .set('content-type', 'application/json')
        .send(sendSKU)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const putSKU={
    
        "newDescription" : "HP Pavillion",
        "newWeight" : 1,
        "newVolume" : 1,
        "newNotes" : "non male",
        "newPrice" : 860,
        "newAvailableQuantity" : 4
    
}

describe('put /api/sku/:id', function() {
    it('Updating an SKU', function(done) {
        agent.put('/api/sku/4')
        .set('content-type', 'application/json')
        .send(putSKU)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})

const newpos={
    "position": "800234523412"
}

describe('put /api/sku/:id/position', function() {
    it('Updating an SKU position', function(done) {
        agent.put('/api/sku/4/position')
        .set('content-type', 'application/json')
        .send(newpos)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})

describe('delete /api/SKU/:id', function() {
    it('deleting an SKU given its id', function(done) {
        agent.delete('/api/SKU/4',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})