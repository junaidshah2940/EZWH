const { expect } = require('chai');
const { deleteInternalOrder, getAllInternalOrders, getIssuedInternalOrder, getInternalOrderById, updateInternalOrder, getAcceptedInternalOrder, createInternalOrder, TempInternalOrder } = require('../app_logic_tier/ManageOrder');
const { internalOrderElaborate } = require('../app_logic_tier/service');
const { createDatabase, deleteDatabase } = require('../database/createDatabase');
const { InternalOrder } = require('../data_tier/InternalOrder');


beforeAll(async ()=> {
    await createDatabase();
})

afterAll(async ()=> {
    await deleteDatabase();
})

testDeleteInternalOrder('ok');

let products = [{ SKUId: 12, description: "a product", price: 10.99, qty: 30 }, { SKUId: 180, description: "another product", price: 11.99, qty: 20 }];
const io = new InternalOrder('ISSUED', undefined, products, '2021/11/29 09:33', undefined, 1)


let io1 = [new TempInternalOrder(null, '2021/11/29 09:33', 'ISSUED', 12, 'a product', 10.99, 30, null, null),
new TempInternalOrder(null, '2021/11/29 09:33', 'ISSUED', 180, 'another product', 10.99, 20, null, null)]


testCreateInternalOrder(io);

testGetAllInternalOrders(io1);

testGetIssuedInternalOrders(io1);

testUpdateInternalOrder('ACCEPTED', [], 'ok');

testGetInternalOrderById(1, io1);
testGetInternalOrderById(10, []);

testUpdateInternalOrder('DELIVERED', [{ "SkuID": 1, "RFID": "12345678901234567890123456789016" }, { "SkuID": 1, "RFID": "12345678901234567890123456789038" }], 'ok');

testUpdateInternalOrder('COMPLETED', [{ "SkuID": 1, "RFID": "12345678901234567890123456789016" }, { "SkuID": 1, "RFID": "12345678901234567890123456789038" }], 'ok');

testGetInternalOrderById(1, io1);
testGetInternalOrderById(10, []);

testDeleteInternalOrder(io.id, 'ok');

function testGetAllInternalOrders(expectedOutput) {

    test('test get all restock orders', async () => {
        let orders = await getAllInternalOrders();
        expect(orders).to.eql(expectedOutput);
    })
}

function testGetIssuedInternalOrders(expectedOutput) {
    test('test get all issued internal order', async () => {
        let orders = await getIssuedInternalOrder();
        expect(orders).to.eql(expectedOutput);
    });
}

function testGetAcceptedInternalOrder(expectedOutput) {
    test('test get all internal order', async () => {
        let orders = await getAcceptedInternalOrder();
        expect(orders).to.eql(expectedOutput);
    })

}

testGetAcceptedInternalOrder(io1);

function testGetInternalOrderById(id, expectedOutput) {

    test('test get internal order by id', async () => {
        let orders = await getInternalOrderById(id);
        expect(orders).to.eql(expectedOutput);
    });
}




function testCreateInternalOrder(io) {
    test("test create new restock order", async () => {
        let resp = await createInternalOrder(io);
        expect(resp).equals('ok');

    })
}




function testUpdateInternalOrder(newState, skuItems, expectedOutput) {
    test("test update state of a restock order", async () => {
        const lastId = await getLastId();
        let resp = await updateInternalOrder(lastId, newState, skuItems);
        expect(resp).equals(expectedOutput);
    })
}




function testDeleteInternalOrder(expectedOutput) {
    test('test delete a internal order given the id', async () => {
        const lastId = await getLastId();
        let resp = await deleteInternalOrder(lastId);
        expect(resp).equals(expectedOutput);
    })
}


async function getLastId() {

    let lastIdVec = await getLastInternalOrderId();
    const lastId = lastIdVec[0].id;
    return lastId;
}


const allInternalOrdersAPI = []


function testGetInternalOrdersAPI(expectedOutput) {
    test("test get return items from a restock order", async () => {
        let orders = await getInternalOrderById(id);
        let resp = await internalOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    })
}

testGetInternalOrdersAPI(allInternalOrdersAPI);

const IssuedInternalOrdersAPI = [
]

function testGetIssuedInternalOrdersAPI(expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getIssuedInternalOrder();
        let resp = await internalOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetIssuedInternalOrdersAPI(IssuedInternalOrdersAPI);


const acceptedInternalOrdersAPI = [
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

function testGetAcceptedInternalOrdersAPI(expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getAcceptedInternalOrder();
        let resp = await internalOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetAcceptedInternalOrdersAPI(acceptedInternalOrdersAPI);


const internalOrderByIdAPI = []

function testGetInternalOrderByIdAPI(id, expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getInternalOrderById(id);
        let resp = await internalOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetInternalOrderByIdAPI(1, internalOrderByIdAPI);
testGetInternalOrderByIdAPI(18, []);
