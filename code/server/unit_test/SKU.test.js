const { expect } = require('chai');
const { getAllSKU, getSKU, addNewSKU, modifySKU, modifySKUPosition, deleteSKU } = require('../app_logic_tier/ManageSKUs');
const { SKU } = require('../data_tier/SKU');
require('./Position.test');
const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});


function nSKU(id, description, weight, volume, notes, position, availableQuantity, price, testDescriptors) {
    this.newId = id;
    this.newDescription = description;
    this.newWeight = weight;
    this.newVolume = volume;
    this.newNotes = notes;
    this.newPosition = position;
    this.newAvailableQuantity = availableQuantity;
    this.newPrice = price;
    this.newTestDescriptors = testDescriptors;
};
  

let allSKU= [
    new SKU(1, "Apple iPhone 13", 1, 1, "che schifo", "1", 2,  1290, 1),
    new SKU(2, "Samsung galaxy s21+", 2.5, 2.5, "direi un po' meglio", "2", 1, 1000, 2),
    new SKU(3, "logitech mx master 3", 55, 0.8, null, "3", 4, 89, 3)
]


 
testGetAllSKU(allSKU);

let expSKU = new SKU(2, "Samsung galaxy s21+", 2.5, 2.5, "direi un po' meglio", "2", 1, 1000, 2);

testGetSKU(id, expSKU);

let newSKU = new SKU(4, "HP Pavillion", 4, 7, "non male", "111122223333", 2, 800, 5);

testCreateSKU(newSKU);

let newSKU2 = new nSKU(4, "HP Pavillion", 4, 7, "non male", "111122223333", 2, 700, 5);
let newSKU2exp = new SKU(4, "HP Pavillion", 4, 7, "non male", "111122223333", 2, 700, 5);
testModifySKU(newSKU.id, newSKU2, newSKU2exp);

let newSKU3 = new nSKU(4, "HP Pavillion", 4, 7, "non male", "111122223334", 2, 700, 5);
let newSKU3exp = new SKU(4, "HP Pavillion", 4, 7, "non male", "111122223334", 2, 700, 5);
testModifySKUposition(newSKU.id, newSKU3, newSKU3exp);

testDeleteSKU(newSKU.id);

function testGetAllSKU(expectedOutput) {

    test('test get all SKU', async () => {
        let sku = await getAllSKU();
        expect(JSON.stringify(sku)).equals(JSON.stringify(expectedOutput));
    })
}

function testGetSKU(id, expectedOutput) {

    test('test get SKU by id', async () => {
        let SKU = await getSKU(id);
        expect(JSON.stringify(SKU)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreateSKU(newsku){
    test("test add new SKU", async () => {
        let resp = await addNewSKU(newsku);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let SKU = await getSKU(newsku.id);
        expect(JSON.stringify(SKU)).equals(JSON.stringify(newsku));
    });
}

function testModifySKU(id, newSKU, expectedOutput){
    test("test update SKU", async () => {
        let resp = await modifySKU(id, newSKU);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let SKU = await getSKU(id);
        expect(JSON.stringify(SKU)).equals(JSON.stringify(expectedOutput));
    });
}


function testModifySKUposition(id, newSKU, expectedOutput){
    test("test update SKU position", async () => {
        let resp = await modifySKUPosition(id, newSKU.newPosition);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let SKU = await getSKU(id);
        expect(JSON.stringify(SKU)).equals(JSON.stringify(expectedOutput));
    });
}


function testDeleteSKU(id){
    test('test delete an SKU given the id', async() => {
        let resp = await deleteSKU(id);
        expect(resp).equals(undefined);
    })

}