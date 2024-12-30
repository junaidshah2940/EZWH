const{ expect } = require('chai');
const { db } = require('../app_logic_tier/login');
const { getAllRestockOrders, TempOrder, getIssuedRestockOrders, getRestockOrdersById, getItemsFromRestockOrderById, createRestockOrder, updateStatus, setRestockOrderSKUItems, setTrasportNoteRestockOrder, deleteRestockOrder, getLastRestockOrderId } = require('../app_logic_tier/ManageOrder');
const { restockOrderElaborate } = require('../app_logic_tier/service');
const { createDatabase,deleteDatabase } = require('../database/createDatabase');
const { RestockOrder } = require('../data_tier/RestockOrder');


beforeAll(async ()=> {
    await createDatabase();
})

afterAll(async ()=> {
    await deleteDatabase();
})

function testGetAllRestockOrders(expectedOutput) {

    test('test get all restock orders', async () => {
        let orders = await getAllRestockOrders();
        expect(orders).to.eql(expectedOutput);
    })
}


testGetAllRestockOrders([]);

function testGetIssuedRestockOrders(expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getIssuedRestockOrders();
        expect(orders).to.eql(expectedOutput);
    });
}

testGetIssuedRestockOrders([]);


let products = [{SKUId : 12,itemId:10, description:"a product", price:10.99,qty:30}, {SKUId:180,itemId:18,description:"another product",price:11.99,qty:20}];
const ro = new RestockOrder ('ISSUED',undefined,products , 1, '2021/11/29 09:33',[],undefined)


function testCreateRestockOrder(ro){
    test("test create new restock order", async () => {
        let resp = await createRestockOrder(ro);
        expect(resp).equals('ok');

    })
}

testCreateRestockOrder(ro);

let testRestockOrder = [new TempOrder(1,'2021/11/29 09:33','ISSUED',12,"a product", 10.99,30,1,null,null,10), 
new TempOrder(1,'2021/11/29 09:33','ISSUED',180,"another product",11.99,20,1,null,null,18)];

testGetAllRestockOrders(testRestockOrder);
testGetIssuedRestockOrders(testRestockOrder);

function testUpdateStatus(newState,expectedOutput){
    test("test update state of a restock order", async () => {
        const lastId = await getLastId();
        let resp = await updateStatus(lastId,newState);
        expect(resp).equals(expectedOutput);
    })
}

testUpdateStatus('DELIVERED','ok');

let newStateRestock = [new TempOrder(1,'2021/11/29 09:33','DELIVERED',12,"a product", 10.99,30,1,null,null,10), 
new TempOrder(1,'2021/11/29 09:33','DELIVERED',180,"another product",11.99,20,1,null,null,18)];

testGetAllRestockOrders(newStateRestock);
testGetIssuedRestockOrders([]);

function testInsertSKUitems(newSKUItems){
    test('test insert SKU items in the last restock order', async() => {
        const lastId = await getLastId();
        let resp = await setRestockOrderSKUItems(lastId, newSKUItems);
        expect(resp).equals(undefined);
    }) 
}

let newSKUItems = [{ SKUId:12,itemId:10,rfid :"12345678901234567890123456789018"},{SKUId:180,itemId:18,rfid:"12345678901234567890123456789019"}];
testInsertSKUitems(newSKUItems);

function testInsertTrasportNote(trasportNote,expectedOutput){
    test('test insert new trasport note in the restock order with the given id', async()=> {
        const lastId = await getLastId();
        let resp = await setTrasportNoteRestockOrder(lastId,JSON.stringify(trasportNote));
        expect(resp).equals(expectedOutput);
    })
}

let trasportNote = {deliveryDate :"2021/12/29"};
testInsertTrasportNote(trasportNote,'ok');

let trasportNoteSkuItemsRestock = [new TempOrder(1,'2021/11/29 09:33','DELIVERED',12,"a product", 10.99,30,1,trasportNote,"12345678901234567890123456789018",10), 
new TempOrder(1,'2021/11/29 09:33','DELIVERED',180,"another product",11.99,20,1,trasportNote,"12345678901234567890123456789019",18)];

testGetAllRestockOrders(trasportNoteSkuItemsRestock);
testGetIssuedRestockOrders([]);

function testDeleteRestockOrder(expectedOutput){
    test('test delete a restock order given the id', async() => {
        const lastId = await getLastId();
        let resp = await deleteRestockOrder(lastId);
        expect(resp).equals(expectedOutput);
    })
}

restockOrdersWithId1 = [new TempOrder(1,'2021/11/29 09:33','DELIVERED',12,"a product", 10.99,30,1,trasportNote,"12345678901234567890123456789018",10), 
new TempOrder(1,'2021/11/29 09:33','DELIVERED',180,"another product",11.99,20,1,trasportNote,"12345678901234567890123456789019",18)
];


function testGetRestockOrderById(id,expectedOutput){

    test('test get restock order by id', async () => {
        let orders = await getRestockOrdersById(id);
        expect(orders).to.eql(expectedOutput);
    });
}

testGetRestockOrderById(1, restockOrdersWithId1);
testGetRestockOrderById(18, []);

testDeleteRestockOrder('ok');


function testGetItemsFromRestockOrderById(id,expectedOutput){
    test("test get return items from a restock order", async () => {
        let orders = await getItemsFromRestockOrderById(id);
        expect(orders).to.eql(expectedOutput);
    })
}
testGetItemsFromRestockOrderById(2,[]);
testGetItemsFromRestockOrderById(3,[]);


async function getLastId(){

    let lastIdVec = await getLastRestockOrderId();
    const lastId = lastIdVec[0].id;
    return lastId;
}

const allRestockOrdersAPI = [
    new RestockOrder("DELIVERED",1,products,1,'2021/11/29 09:33',newSKUItems,trasportNote)
]

function testGetRestockOrdersAPI(expectedOutput){
    test("test get return items from a restock order", async () => {
        let orders = await getItemsFromRestockOrderById(id);
        let resp = await restockOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    })
}

testGetRestockOrdersAPI(allRestockOrdersAPI);

const IssuedRestockOrdersAPI = []

function testGetIssuedRestockOrdersAPI(expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getIssuedRestockOrders();
        let resp = await restockOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetIssuedRestockOrdersAPI(IssuedRestockOrdersAPI);


function testGetRestockOrderByIdAPI(id, expectedOutput) {
    test('test get all issued restock order', async () => {
        let orders = await getRestockOrdersById(id);
        let resp = await restockOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetRestockOrderByIdAPI(1, allRestockOrdersAPI);
testGetRestockOrderByIdAPI(18, []);

const returnItems = []

function testGetItemsFromRestockOrderByIdAPI(id,expectedOutput){
    test("test get return items from a restock order", async () => {
        let orders = await getItemsFromRestockOrderById(id);
        let resp = await restockOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    })
}

testGetItemsFromRestockOrderByIdAPI(2,returnItems);