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

const allRestockOrders = [
    {
        "state": "DELIVERED",
        "orderId": 1,
        "products": [
            {
                "id": 1,
                "itemId":1,
                "description": "Apple iPhone 13",
                "availableQuantity": 1,
                "price": 1290
            }
        ],
        "supplierId": 10,
        "issueDate": "18/09/1962",
        "SKUItems": [
            {
                "SKUId": 1,
                "itemId":1,
                "RFID": "6168483648673864"
            },
            {
                "SKUId": 1,
                "itemId":1,
                "RFID": "6168483648673865"
            }
        ],
        "trasportNote": null
    },
    {
        "state": "TESTED",
        "orderId": 2,
        "products": [
            {
                "id": 2,
                "itemId":2,
                "description": "Samsung galaxy s21+",
                "availableQuantity": 2,
                "price": 1000
            }
        ],
        "supplierId": 18,
        "issueDate": "22/03/2003",
        "SKUItems": [
            {
                "SKUId": 2,
                "itemId":2,
                "RFID": "6168483648673866"
            }
        ],
        "trasportNote": null
    },
    {
        "state": "DELIVERED",
        "orderId": 3,
        "products": [
            {
                "id": 3,
                "itemId":3,
                "description": "logitech mx master 3",
                "availableQuantity": 3,
                "price": 89
            }
        ],
        "supplierId": 10,
        "issueDate": "29/06/2003",
        "SKUItems": [
            {
                "SKUId": 3,
                "itemId":3,
                "RFID": "6168483648673867"
            }
        ],
        "trasportNote": null
    },
    {
        "state": "ISSUED",
        "orderId": 23,
        "products": [
            {
                "id": 4,
                "itemId":4,
                "description": "Huawei p20",
                "availableQuantity": 5,
                "price": 780
            }
        ],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    },
    {
        "state": "ISSUED",
        "orderId": 24,
        "products": [],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    },
    {
        "state": "ISSUED",
        "orderId": 26,
        "products": [],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    }
]

describe('get /api/restockOrders', function() {
    it('Getting all restock orders', function(done) {
        agent.get('/api/restockOrders')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.should.be.eql(allRestockOrders);
            done()
        }).catch(done);
    } )
})

const IssuedRestockOrders = [
    {
        "state": "ISSUED",
        "orderId": 23,
        "products": [
            {
                "id": 4,
                "itemId":4,
                "description": "Huawei p20",
                "availableQuantity": 5,
                "price": 780
            }
        ],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    },
    {
        "state": "ISSUED",
        "orderId": 24,
        "products": [],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    },
    {
        "state": "ISSUED",
        "orderId": 26,
        "products": [],
        "supplierId": 1,
        "issueDate": "2021/11/29 09:33",
        "SKUItems": []
    }
]

describe('get /api/restockOrdersIssued', function() {
    it('Getting all issued restock orders', function(done) {
        agent.get('/api/restockOrdersIssued')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.be.a('array')
            res.body.should.be.eql(IssuedRestockOrders);
            done()
        }).catch(done);
    } )
})

const restockOrderById = [{

    "state": "DELIVERED",
    "orderId": 1,
    "products": [
        {
            "id": 1,
            "itemId":1,
            "description": "Apple iPhone 13",
            "availableQuantity": 1,
            "price": 1290
        }
    ],
    "supplierId": 10,
    "issueDate": "18/09/1962",
    "SKUItems": [
        {
            "SKUId": 1,
            "itemId":1,
            "RFID": "6168483648673864"
        },
        {
            "SKUId": 1,
            "itemId":1,
            "RFID": "6168483648673865"
        }
    ],
    "trasportNote": null
}]

describe('get /api/restockOrders/:id', function() {
    it('Getting a restock orders given its id', function(done) {
        agent.get('/api/restockOrders/1')
        .then(function(res) {
            res.should.have.status(200);
            res.body.should.to.be.a('array');
            res.body.should.have.length(1);
            res.body.should.to.eql(restockOrderById);
            done()
        }).catch(done);
    } )
})

const returnItems = [
    {
        "id": 2,
        "issueDate": "22/03/2003",
        "state": "TESTED",
        "SkuId": 2,
        "itemId":2,
        "description": "Samsung galaxy s21+",
        "price": 1000,
        "quantity": 2,
        "supplierId": 18,
        "trasportNote": null,
        "rfid": "6168483648673866"
    }
]

describe('get /api/restockOrders/:id/returnItems', function() {
    it('Getting all skuItems to be returned(test result is false)', function(done) {
        agent.get( '/api/restockOrders/2/returnItems')
        .then(function(res){
            res.should.have.status(200);
            res.body.should.to.be.a('array');
            res.body.should.to.be.eql(returnItems)
            done();
        }).catch(done)
    })
})

describe('get /api/restockOrders/:id/returnItems', function() {
    it('Getting all skuItems to be returned(test result is false)', function(done) {
        agent.get( '/api/restockOrders/aa/returnItems')
        .then(function(res){
            res.should.have.status(422);
            done();
        }).catch(done)
    })
})

describe('get /api/restockOrders/:id/returnItems', function() {
    it('Getting all skuItems to be returned(test result is false)', function(done) {
        agent.get( '/api/restockOrders/8/returnItems')
        .then(function(res){
            res.should.have.status(404);
            done();
        }).catch(done)
    })
})

const ro = {
    "issueDate":"2021/11/29 09:33",
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"qty":30},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20}],
    "supplierId" : 1
}

describe('post /api/restockOrder', function() {
    it('Creating a restock order', function(done) {
        agent.post('/api/restockOrder')
        .set('content-type', 'application/json')
        .send(ro)
        .then(function(res) {
            res.should.have.status(201);
            done();
        }).catch(done);
    })
})

const ro1 = {
    "issueDate":"aaabbb",
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"qty":30},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20}],
    "supplierId" : 1
}

describe('post /api/restockOrder', function() {
    it('Creating a restock order', function(done) {
        agent.post('/api/restockOrder')
        .set('content-type', 'application/json')
        .send(ro1)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const ro2 = {
    "issueDate":"2021/11/29 09:33",
    "products": [],
    "supplierId" : 1
}

describe('post /api/restockOrder', function() {
    it('Creating a restock order', function(done) {
        agent.post('/api/restockOrder')
        .set('content-type', 'application/json')
        .send(ro2)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const ro3 = {
    "issueDate":"2021/11/29 09:33",
    "products": [{"SKUId":12,"itemId":10,"description":"a product","price":10.99,"qty":30},
                {"SKUId":180,"itemId":18,"description":"another product","price":11.99,"qty":20}],
    "supplierId" : undefined
}

describe('post /api/restockOrder', function() {
    it('Creating a restock order', function(done) {
        agent.post('/api/restockOrder')
        .set('content-type', 'application/json')
        .send(ro3)
        .then(function(res) {
            res.should.have.status(422);
            done();
        }).catch(done);
    })
})

const newState = {
    "newState":"DELIVERED"
}
describe('put /api/restockOrder/:id', function() {
    it('Updating a restock order', function(done) {
        agent.put('/api/restockOrder/23')
        .set('content-type', 'application/json')
        .send(newState)
        .then(function(res) {
            res.should.have.status(201);
            done()
        }).catch(done);
    })
})

const newState1 = {
    "newState":undefined
}
describe('put /api/restockOrder/:id', function() {
    it('Updating a restock order', function(done) {
        agent.put('/api/restockOrder/23')
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
describe('put /api/restockOrder/:id', function() {
    it('Updating a restock order', function(done) {
        agent.put('/api/restockOrder/8')
        .set('content-type', 'application/json')
        .send(newState3)
        .then(function(res) {
            res.should.have.status(404);
            done()
        }).catch(done);
    })
})

const skuItems = {
    "skuItems" : [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789029"},{"SKUId":12,"itemId":10,"RFID":"12345678901234567890123456789030"}]
}

describe('put /api/restockOrder/:id/skuitems', function() {
    it('updating skuItems in a restock order', function(done){
        agent.put('/api/restockOrder/24/skuitems')
        .set('content-type','application/json')
        .send(skuItems)
        .then(function(res) {
            res.should.have.status(200)
            done()
        }).catch(done)
    })
})

const skuItems1 = {
    "skuItems" : []
}

describe('put /api/restockOrder/:id/skuitems', function() {
    it('updating skuItems in a restock order', function(done){
        agent.put('/api/restockOrder/24/skuitems')
        .set('content-type','application/json')
        .send(skuItems1)
        .then(function(res) {
            res.should.have.status(422);
            done()
        }).catch(done)
    })
})


const skuItems3 = {
    "skuItems" : [{"SKUId":12,"itemId":10,"rfid":"12345678901234567890123456789029"},{"SKUId":12,"itemId":10,"RFID":"12345678901234567890123456789030"}]
}

describe('put /api/restockOrder/:id/skuitems', function() {
    it('updating skuItems in a restock order', function(done){
        agent.put('/api/restockOrder/8/skuitems')
        .set('content-type','application/json')
        .send(skuItems3)
        .then(function(res) {
            res.should.have.status(404);
            done()
        }).catch(done)
    })
})



const transportNote = {
    "transportNote":{"deliveryDate":"2021/12/29"}
}

describe('put /api/restockOrder/:id/transportNote', function() {
    it('updating transport note in a restock order', function(done){
        agent.put('/api/restockOrder/23/transportNote')
        .set('content-type','application/json')
        .send(transportNote)
        .then(function(res) {
            res.should.have.status(200)
            done()
        }).catch(done)
    })
})

describe('put /api/restockOrder/:id/transportNote', function() {
    it('updating transport note in a restock order', function(done){
        agent.put('/api/restockOrder/aaa/transportNote')
        .set('content-type','application/json')
        .send(transportNote)
        .then(function(res) {
            res.should.have.status(422)
            done()
        }).catch(done)
    })
})

describe('put /api/restockOrder/:id/transportNote', function() {
    it('updating transport note in a restock order', function(done){
        agent.put('/api/restockOrder/56464/transportNote')
        .set('content-type','application/json')
        .send(transportNote)
        .then(function(res) {
            res.should.have.status(404)
            done()
        }).catch(done)
    })
})

describe('delete /api/restockOrder/:id', function() {
    it('deleting a restock order given its id', function(done) {
        agent.delete('/api/restockOrder/47',)
        .then(function(res) {
            res.should.have.status(204);
            done();
        }
        ).catch(done);
    })
})

describe('delete /api/restockOrder/:id', function() {
    it('deleting a restock order given its id', function(done) {
        agent.delete('/api/restockOrder/2873',)
        .then(function(res) {
            res.should.have.status(404);
            done();
        }
        ).catch(done);
    })
})

