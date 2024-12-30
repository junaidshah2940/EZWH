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


describe('get /api/hello', function() {
    it('Getting hello world', function (done) {
        agent.get('/api/hello')
        .then( function(res) {
            res.should.have.status(200);
            res.body.message.should.equal('Hello World!');
            done();
        })
    })
})

const allReturnOrders = [
    {
        restockOrderId: 3,
        returnDate: "28/04/2020",
        products: [
            {
                SKUid: 3,
                itemId:3,
                description: "logitech mx master 3",
                price: 89,
                RFID: "6168483648673867"
            }
        ]
    },
    {
        restockOrderId: 1,
        returnDate: "2021/11/29 09:33",
        products: [
            {
                SKUid: 1,
                itemId:1,
                description: "Apple iPhone 13",
                price: 1290,
                RFID: "6168483648673864"
            },
            {
                SKUid: 1,
                itemId:1,
                description: "Apple iPhone 13",
                price: 1290,
                RFID: "6168483648673865"
            }
        ]
    }
]


describe('get /api/returnOrders', function () {
    it('Getting all return orders', function (done) {
        agent.get('/api/returnOrders')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allReturnOrders);
            done();
        }).catch(done)
    })
})

describe ('get /api/returnOrder/:id', function() {
    it('Retrieving a return order given the id', function (done) {
        agent.get('/api/returnOrder/3')
        .then( function(res) {
            res.should.have.status(404);
            done()
        }).catch(done)
    })
})

const returnOrderbyId = [{

    restockOrderId: 3,
    returnDate: "28/04/2020",
    products: [
        {
            SKUid: 3,
            itemId:3,
            description: "logitech mx master 3",
            price: 89,
            RFID: "6168483648673867"
        }
    ]
}];

describe('get /api/returnOrder/:id', function() {
    it('Retrieving a return order given the id', function (done) {
        agent.get('/api/returnOrder/2')
        .then(function(res){
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.to.eql(returnOrderbyId);
            done();
        }).catch(done);
    })
})


describe('get /api/returnOrder/:id', function() {
    it('Retrieving a return order given the id', function (done) {
        agent.get('/api/returnOrder/aasds')
        .then(function(res){
            res.should.have.status(404);
            done();
        }).catch(done);
    })
})

describe('get /api/returnOrder/:id', function() {
    it('Retrieving a return order given the id', function (done) {
        agent.get('/api/returnOrder/3687')
        .then(function(res){
            res.should.have.status(404);
            done();
        }).catch(done);
    })
})

const reo = {
    "returnDate":"2021/11/29 09:33",
    "products": [{"SKUId":12, "itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
    "restockOrderId" : 1
}

describe ('post /api/returnOrder', function() {
    it('Adding a return order', function(done) {
        agent.post('/api/returnOrder')
        .set('content-type', 'application/json')
        .send(reo)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})


const reo1 = {
    "returnDate":undefined,
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
    "restockOrderId" : 1
}

describe ('post /api/returnOrder', function() {
    it('Adding a return order', function(done) {
        agent.post('/api/returnOrder')
        .set('content-type', 'application/json')
        .send(reo1)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const reo2 = {
    "returnDate":"non-date",
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
    "restockOrderId" : 1
}

describe ('post /api/returnOrder', function() {
    it('Adding a return order', function(done) {
        agent.post('/api/returnOrder')
        .set('content-type', 'application/json')
        .send(reo2)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const reo3 = {
    "returnDate":"2021/11/29 09:33",
    "products": [],
    "restockOrderId" : 1
}

describe ('post /api/returnOrder', function() {
    it('Adding a return order', function(done) {
        agent.post('/api/returnOrder')
        .set('content-type', 'application/json')
        .send(reo3)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const reo4 = {
    "returnDate":"2021/11/29 09:33",
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99, "RFID":"12345678901234567890123456789016"},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}],
    "restockOrderId" : undefined
}

describe ('post /api/returnOrder', function() {
    it('Adding a return order', function(done) {
        agent.post('/api/returnOrder')
        .set('content-type', 'application/json')
        .send(reo4)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

describe ('delete /api/returnOrder/:id', function() {
    it('Deleting a return order', function(done) {
        agent.delete('/api/returnOrder/22')
        .then(function(res){
            res.should.have.status(204);
            done();
        }).catch(done);
    })
})

describe ('delete /api/returnOrder/:id', function() {
    it('Deleting a return order', function(done) {
        agent.delete('/api/returnOrder/6848486')
        .then(function(res){
            res.should.have.status(404);
            done();
        }).catch(done);
    })
})

describe ('delete /api/returnOrder/:id', function() {
    it('Deleting a return order', function(done) {
        agent.delete('/api/returnOrder/notid')
        .then(function(res){
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})