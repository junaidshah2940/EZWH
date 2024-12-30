const { expect } = require('chai');
const  { getAllItem, getItem, modifyItem, addNewItem, deleteItem}= require('../app_logic_tier/ManageItems');
const { Item } = require('../data_tier/Item');
  
const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});

function nItem(id, description, SKUid, supplierID,  price ) {
    this.id = id;
    this.newDescription = description;
    this.SKUid = SKUid;
    this.supplierID = supplierID;
    this.newPrice = price;
}
const allItems= [
    new Item(1, "Apple iPhone 18", 1, 18,  1290,5),
    new Item(2, "Samsung galaxy s21", 2, 10, 1000,5),
    new Item(3, "Logitech mx master 3", 3, 18, 0,5 )
]

 
testGetAllItem(allItems);

const expItem = new nItem(2, "Samsung galaxy s21", 2, 10, 1000);

testGetItem(2,10,expItem);

const newItem = new Item(4, "HP Pavillion", 3, 10, 800,5);

testCreateItem(newItem);

const newItem2 = new nItem(4, "HP Pavillion", 3, 10, 700);
const newItem2exp = new nItem(4, "HP Pavillion", 3, 10, 700);
testModifyItem(newItem.id,newItem.supplierID, newItem2, newItem2exp)

testDeleteItem(4,10);

function testGetAllItem(expectedOutput) {

    test('test get all items', async () => {
        let items = await getAllItem();
        expect(JSON.stringify(items)).equals(JSON.stringify(expectedOutput));
    })
}

function testGetItem(id,supplierID,expectedOutput) {

    test('test get item by id and supplierID', async () => {
        let item = await getItem(id,supplierID);
        expect(JSON.stringify(item)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreateItem(newitem){
    test("test add new item", async () => {
        let resp = await addNewItem(newitem);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let item = await getItem(newitem.id);
        expect(JSON.stringify(item)).equals(JSON.stringify(newitem));
    });
}

function testModifyItem(id,supplierID, newItem, expectedOutput){
    test("test update item", async () => {
        let resp = await modifyItem(id,newItem,supplierID);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let item = await getItem(id,supplierID);
        expect(JSON.stringify(item)).equals(JSON.stringify(expectedOutput));
    });
}

function testDeleteItem(id,supplierID){
    test('test delete an item given the id', async() => {
        let resp = await deleteItem(id,supplierID);
        expect(resp).equals(undefined);
    })

}