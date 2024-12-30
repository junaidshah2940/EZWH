const { expect } = require("chai");
const { getAllReturnOrder, TempReturnOrder, getReturnOrderById, createReturnOrder, deleteReturnOrder, getLastReturnOrderId } = require("../app_logic_tier/ManageOrder");
const { returnOrderElaborate } = require("../app_logic_tier/service");
const { ReturnOrder } = require("../data_tier/ReturnOrder");
const {createDatabase, deleteDatabase} = require("../database/createDatabase")
require('./RestockOrder.test');

beforeAll(async ()=> {
    await createDatabase();
})

afterAll(async ()=> {
    await deleteDatabase();
})


let products = [{SKUId:12,itemId:10,description:"a product",price:10.99,rfid:"12345678901234567890123456789016"},
            {SKUId:180,itemId:18,description:"another product",price:11.99,rfid:"12345678901234567890123456789038"}]

const reo = new ReturnOrder(1,1,"2021/11/29 09:33",products);

const returnOrders = [
]


testGetAllReturnOrder(returnOrders);


const returnOrderId=[
    new TempReturnOrder(
        1,
        1,
        "2021/11/29 09:33",
        3,
        "a product",
        10.99,
        1,
        "12345678901234567890123456789016",
        10
    ),
    new TempReturnOrder(
        1,
        1,
        "2021/11/29 09:33",
        3,
        "another product",
        11.99,
        1,
        "12345678901234567890123456789038",
        18
    )
];


testCreateReturnOrder(reo);

testGetReturnOrderById(8,[]);
testGetReturnOrderById(1,returnOrderId);
testGetAllReturnOrder(returnOrderId);

testDeleteReturnOrder();

async function getLastId(){

    const lastIdVec = await getLastReturnOrderId();
    const lastId = lastIdVec[0].id;

    return lastId;
}


function testGetAllReturnOrder(expectedOutput){

    test('test get all return order', async () => {
        let orders = await getAllReturnOrder();
        expect(orders).to.eql(expectedOutput);
    });

}

function testGetReturnOrderById(id,expectedOutput){
    test('test get return order by id', async() => {
        let orders = await getReturnOrderById(id);
        expect(orders).to.eql(expectedOutput);
    })
}

function testCreateReturnOrder(reo){
    test('test create new return order', async() => {
        let response = await createReturnOrder(reo);
        expect(response).equals(undefined);
    })
}

function testDeleteReturnOrder(){
    test('test delete order given the id', async () => {
        const lastId = await getLastId();
        let response = await deleteReturnOrder(lastId);
        expect(response).equals(undefined);
    })
}

const allReturnOrders = [
]

function testGetAllReturnOrderAPI(expectedOutput){

    test('test get all return order', async () => {
        let orders = await getAllReturnOrder();
        let resp = await returnOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    });
}

testGetAllReturnOrderAPI(allReturnOrders);

testCreateReturnOrder(reo);
testGetAllReturnOrderAPI(reo);

function testGetReturnOrderByIdAPI(id,expectedOutput){
    test('test get return order by id', async() => {
        let orders = await getReturnOrderById(id);
        let resp = await returnOrderElaborate(orders);
        expect(resp).to.eql(expectedOutput);
    })
}
testGetReturnOrderByIdAPI(2,reo);