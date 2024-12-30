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

const allInternalOrders = [
    {
        "state": "ISSUED",
        "orderId": 1,
        "products": [
            {
                "description": "Apple iPhone 13",
                "availableQuantity": 1,
                "price": 1290
            }
        ],
        "date": null,
        "customerId": 9
    },
    {
        "state": "REFUSED",
        "orderId": 2,
        "products": [
            {
                "description": "logitech mx master 3",
                "availableQuantity": 1,
                "price": 89
            }
        ],
        "date": "25/06/2000",
        "customerId": 29
    },
    {
        "state": "ACCEPTED",
        "orderId": 3,
        "products": [
            {
                "description": "Samsung galaxy s21+",
                "availableQuantity": 1,
                "price": 1000
            }
        ],
        "date": "25/06/1845",
        "customerId": 9
    },
    {
        "state": "ISSUED",
        "orderId": 5,
        "products": [],
        "date": null,
        "customerId": 1
    },
    {
        "state": "ISSUED",
        "orderId": 6,
        "products": [],
        "date": null,
        "customerId": 1
    },
    {
        "state": "ISSUED",
        "orderId": 7,
        "products": [],
        "date": null,
        "customerId": 1
    },
    {
        "state": "COMPLETED",
        "orderId": 8,
        "products": [
            {
                "RFID": "6168483648673866",
                "SKUId": 2
            }
        ],
        "date": "25/06/1845",
        "customerId": 1
    }
]

describe('get /api/internalOrders', function() {
    it('Getting all internal orders', function(done) {
        agent.get('/api/internalOrders')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allInternalOrders);
            done()
        }).catch(done);
    } )
})

const IssuedInternalOrders = [{
    "state": "ISSUED",
    "orderId": 1,
    "products": [
        {
            "description": "Apple iPhone 13",
            "availableQuantity": 1,
            "price": 1290
        }
    ],
    "date": null,
    "customerId": 9
},
{
    "state": "ISSUED",
    "orderId": 5,
    "products": [],
    "date": null,
    "customerId": 1
},
{
    "state": "ISSUED",
    "orderId": 6,
    "products": [],
    "date": null,
    "customerId": 1
},
{
    "state": "ISSUED",
    "orderId": 7,
    "products": [],
    "date": null,
    "customerId": 1
}
]

describe('get /api/internalOrdersIssued', function() {
    it('Getting all issued restock orders', function(done) {
        agent.get('/api/internalOrdersIssued')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array')
            res.body.should.be.eql(IssuedInternalOrders);
            done()
        }).catch(done);
    } )
})

const acceptedInternalOrders = [
    {
        "state": "ACCEPTED",
        "orderId": 3,
        "products": [
            {
                "description": "Samsung galaxy s21+",
                "availableQuantity": 1,
                "price": 1000
            }
        ],
        "date": "25/06/1845",
        "customerId": 9
    }
]

describe('get /api/acceptedOrdersIssued', function() {
    it('Getting all issued restock orders', function(done) {
        agent.get('/api/internalOrdersAccepted')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array')
            res.body.should.be.eql(acceptedInternalOrders);
            done()
        }).catch(done);
    } )
})

const InternalOrderById = [
    {
        "state": "COMPLETED",
        "orderId": 8,
        "products": [
            {
                "RFID": "6168483648673866",
                "SKUId": 2
            }
        ],
        "date": "25/06/1845",
        "customerId": 1
    }
]

describe('get /api/internalOrders/:id', function() {
    it('Getting a restock orders given its id', function(done) {
        agent.get('/api/internalOrders/8')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.to.be.a('array');
            res.body.should.have.length(1);
            res.body.should.to.eql(InternalOrderById);
            done()
        }).catch(done);
    } )
})

const io = {
    "issueDate":"2021/11/29 09:33",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
    "customerId" : 1
}
describe('post /api/internalOrder', function() {
    it('Creating a internal order', function(done) {
        agent.post('/api/internalOrder')
        .set('content-type', 'application/json')
        .send(io)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const io1 = {
    "issueDate":"aaabb",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
    "customerId" : 1
}
describe('post /api/internalOrder', function() {
    it('Creating a internal order', function(done) {
        agent.post('/api/internalOrder')
        .set('content-type', 'application/json')
        .send(io1)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const io2 = {
    "issueDate":"2021/11/29 09:33",
    "products": [],
    "customerId" : 1
}
describe('post /api/internalOrder', function() {
    it('Creating a internal order', function(done) {
        agent.post('/api/internalOrder')
        .set('content-type', 'application/json')
        .send(io2)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const io3 = {
    "issueDate":"2021/11/29 09:33",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
    "customerId" : undefined
}

describe('post /api/internalOrder', function() {
    it('Creating a internal order', function(done) {
        agent.post('/api/internalOrder')
        .set('content-type', 'application/json')
        .send(io3)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const newState = {
    "newState":"DELIVERED"
}

describe('put /api/internalOrder/:id', function() {
    it('Updating a internal order', function(done) {
        agent.put('/api/internalOrder/8')
        .set('content-type', 'application/json')
        .send(newState)
        .then(function(res) {
            res.should.have.status(200);
            done()
        }).catch(done);
    })
})

const newState1 = {
    "newState":undefined
}
describe('put /api/internalOrder/:id', function() {
    it('Updating a internal order', function(done) {
        agent.put('/api/internalOrder/8')
        .set('content-type', 'application/json')
        .send(newState1)
        .then(function(res) {
            res.should.have.status(422);
            done()
        }).catch(done);
    })
})


const newState3 = {
    "newState":"DELIVERED"
}
describe('put /api/internalOrder/:id', function() {
    it('Updating a internal order', function(done) {
        agent.put('/api/internalOrder/10')
        .set('content-type', 'application/json')
        .send(newState3)
        .then(function(res) {
            res.should.have.status(404);
            done()
        }).catch(done);
    })
})

const newState4 = {
    "newState":"COMPLETED",
    "products":[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
}

describe('put /api/internalOrder/:id', function() {
    it('Updating a internal order', function(done) {
        agent.put('/api/internalOrder/10')
        .set('content-type', 'application/json')
        .send(newState4)
        .then(function(res) {
            res.should.have.status(200);
            done()
        }).catch(done);
    })
})

describe('delete /api/internalOrder/:id', function() {
    it('deleting a internal order given its id', function(done) {
        agent.delete('/api/internalOrder/7',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})

describe('delete /api/internalOrder/:id', function() {
    it('deleting a restock order given its id', function(done) {
        agent.delete('/api/internalOrder/2873',)
        .then(function(res) {
            res.should.have.status(404);
            done();
        }
        ).catch(done);
    })
})

