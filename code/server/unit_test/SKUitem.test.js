'use strict'
const { expect } = require('chai');
const { getAllSKUitem, getSKUitem, getSKUitemBySKU, addNewSKUitem, modifySKUitem, deleteSKUitem } = require('../app_logic_tier/ManageSKUs');
const { SKUitem } = require('../data_tier/SKUitem');
require('./SKU.test')
  
const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});

function nSKUitem(rfid, available, dateOfStock, SKUid ) {
    
    this.newSKUid = SKUid
    this.newRFID = rfid;
    this.newAvailable = available;
    this.newDateOfStock = dateOfStock;
};

const allSKUitem= [
    new SKUitem("6168483648673864", 1, "18/06/2020", 1),
    new SKUitem("6168483648673865", 1, "19/02/2020", 1),
    new SKUitem("6168483648673866", 1, "25/06/1845", 2),
    new SKUitem("6168483648673867",  1, "25/06/2000", 3),
    new SKUitem("6168483648673868", 1, "22/01/2021", 3), 
    new SKUitem("12345678901234567890123456789016", 1, null, 1),
    new SKUitem("12345678901234567890123456789038", 1, null, 1)
];


 
testGetAllSKUitem(allSKUitem);

const expSKUitem = new SKUitem("6168483648673865", 1, "19/02/2020", 1);

testGetSKUitem(expSKUitem.RFID, expSKUitem);

const newSKUitem = new SKUitem("111112222233333444445555566", 1, null, 2);

testCreateSKUitem(newSKUitem);

const newSKUitem2 = new nSKUitem("111112222233333444445555566", 0, null, 2);
const newSKUitem2exp = new SKUitem("111112222233333444445555566", 0, null, 2);
testModifySKUitem(newSKUitem.RFID, newSKUitem2, newSKUitem2exp);

const SkuItemBySKU= [
    new SKUitem("6168483648673864", 1, "18/06/2020", 1),
    new SKUitem("6168483648673865", 1, "19/02/2020", 1),
    new SKUitem("12345678901234567890123456789016", 1, null, 1),
    new SKUitem("12345678901234567890123456789038", 1, null, 1)];
testGetSKUitemBySKU(1, SkuItemBySKU);

testDeleteSKUitem("111112222233333444445555566");

function testGetAllSKUitem(expectedOutput) {

    test('test get all SKUitem', async () => {
        let SKUitem = await getAllSKUitem();
        expect(JSON.stringify(SKUitem)).equals(JSON.stringify(expectedOutput));
    })
}

function testGetSKUitem(id, expectedOutput) {

    test('test get SKUitem by rfid', async () => {
        let SKUitem = await getSKUitem(id);
        expect(JSON.stringify(SKUitem)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreateSKUitem(skuitem){
    test("test add new SKUitem", async () => {
        let resp = await addNewSKUitem(skuitem);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let SKUitem = await getSKUitem(skuitem.RFIF);
        expect(JSON.stringify(SKUitem)).equals(JSON.stringify(skuitem));
    });
}

function testModifySKUitem(id, newSKUitem, exp){
    test("test update SKUitem", async () => {
        let resp = await modifySKUitem(id, newSKUitem);
        expect(resp).equals(undefined);
    });
    test("test updated correctly", async () => {
        let SKUitem = await getSKUitem(newSKUitem.newRFID);
        expect(JSON.stringify(SKUitem)).equals(JSON.stringify(exp));
    });
}


function testGetSKUitemBySKU(id, expectedOutput){
    test("test get SKUitem by SKUid", async () => {
        let resp = await getSKUitemBySKU(id);
        expect(JSON.stringify(resp)).equals(JSON.stringify(expectedOutput));
    });

}


function testDeleteSKUitem(id){
    test('test delete an SKUitem given the id', async() => {
        let resp = await deleteSKUitem(id);
        expect(resp).equals(undefined);
    })


}