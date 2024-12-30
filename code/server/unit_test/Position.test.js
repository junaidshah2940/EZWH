'use strict'
const { expect } = require('chai');
const {getAllPosition, getPosition, modifyPosition, modifyPositionID, addNewPosition, deletePosition} = require('../app_logic_tier/ManagePosition');

const { Position } = require('../data_tier/Position');

const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});
 require('./Item.test')
  
function nPosition(positionID, aisleID, row, column, maxVolume,  maxWeight, occupiedVolume, occupiedWeight) {
    this.newPositionID = positionID;
    this.newAisleID = aisleID;
    this.newMaxWeight = maxWeight;
    this.newMaxVolume = maxVolume;
    this.newRow = row;
    this.newColumn = column;
    this.newOccupiedWeight = occupiedWeight;
    this.newOccupiedVolume = occupiedVolume;
};





const allPosition= [
    new Position("123412341234", "1234", "1234", "1234", 100, 100, 10, 10 ),
    new Position("111122223333", "1111", "2222", "3333", 22, 420, 0, 0)
];
 


 
testGetAllPosition(allPosition);

const expPosition =  new Position("123412341234", "1234", "1234", "1234", 100, 100, 10, 10 );

testGetPosition(expPosition.positionID, expPosition);

const newPosition =  new Position("123412341235", "1234", "1234", "1235", 100, 100, null, null );

testCreatePosition(newPosition);

const newPosition2 = new nPosition("123412341235", "1234", "1234", "1235", 100, 100, 30, 30 );
const newPosition2exp = new Position("123412341235", "1234", "1234", "1235", 100, 100, 30, 30 );
testModifyPosition(newPosition.positionID, newPosition2, newPosition2exp);

const newPosition3 = new nPosition("123412341400", "1234", "1234", "1400", 100, 100, 30, 30);
const newPosition3exp = new Position("123412341400", "1234", "1234", "1400", 100, 100, 30, 30);
testModifyPositionID(newPosition.positionID, newPosition3, newPosition3exp);


testDeletePosition("123412341400");

function testGetAllPosition(expectedOutput) {

    test('test get all Position', async () => {
        let position = await getAllPosition();
        expect(JSON.stringify(position)).equals(JSON.stringify(expectedOutput));
    })
}

function testGetPosition(id, expectedOutput) {

    test('test get Position by id', async () => {
        let position = await getPosition(id);
        expect(JSON.stringify(position)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreatePosition(p){
    test("test add new Position", async () => {
        let resp = await addNewPosition(p);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let position = await getPosition(p.positionID);
        expect(JSON.stringify(position)).equals(JSON.stringify(p));
    });
}

function testModifyPosition(id, newPosition, exp){
    test("test update Position", async () => {
        let resp = await modifyPosition(id, newPosition);
        expect(resp).equals(undefined);
    });
    test("test updated correctly", async () => {
        let position = await getPosition(id);
        expect(JSON.stringify(position)).equals(JSON.stringify(exp));
    });
}

function testModifyPositionID(id, newPosition, exp){
    test("test update Position ID", async () => {
        let resp = await modifyPositionID(id, newPosition);
        expect(resp).equals(undefined);
    });
    test("test id updated correctly", async () => {
        let position = await getPosition(newPosition.newPositionID);
        expect(JSON.stringify(position)).equals(JSON.stringify(exp));
    });
}


function testDeletePosition(id){
    test('test delete an Position given the id', async() => {
        let resp = await deletePosition(id);
        expect(resp).equals(undefined);
    })
}