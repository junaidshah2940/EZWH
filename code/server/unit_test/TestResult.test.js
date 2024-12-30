const { expect } = require('chai');
const  { getAllTestResults,getTestResultById,addNewTestResult,modifyTestResult,deleteTestResult }= require('../app_logic_tier/ManageTests');
const { TestResult } = require('../data_tier/TestResult');

const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});


function nTestResult(id,idTestDescriptor,Date, Result,rfid ) {
    this.id = id;
    this.newidTestDescriptor = idTestDescriptor;
    this.newDate = Date;
    this.newResult = Result;
    this.rfid = rfid;
}




const allTestResultsByRfid= [
    new TestResult(1,1,"25/06/2021","true")
]

 
testGetAllTestResults(allTestResultsByRfid);

const expTestResult = new TestResult(3,3,"01/04/2022","false");

testGetTestResultById(expTestResult);

const newTestResult = new TestResult(5,5,"25/11/2022","false","6168483648673868");

testCreateTestResult(newTestResult);

const newTestResult2 = new nTestResult(5,5,"22/10/2022","true");
const newTestResultexp = new TestResult(5,5,"22/10/2022","true");
testModifyTestResult(newTestResult.id,newTestResult.rfid, newTestResult2, newTestResultexp)

testDeleteTestResult(newTestResult.id);

function testGetAllTestResults(expectedOutput) {

    test('test getAllTestResults', async () => {
        let TestResult = await getAllTestResults("6168483648673864");
        expect(JSON.stringify(TestResult)).equals(JSON.stringify(expectedOutput));
    })
}


function testGetTestResultById(expectedOutput) {

    test('test GetTestResultsById', async () => {
        let TestResult = await getTestResultById(3,"6168483648673867");
        expect(JSON.stringify(TestResult)).equals(JSON.stringify(expectedOutput));
    })
}




function testCreateTestResult(t){
    test("test adding new testResult", async () => {
        let resp = await addNewTestResult(t);
        expect(resp).equals(undefined);
    });
//     test("test for new testResult added correctly", async () => {
//         let TestResult = await getTestResultById(t.id,"6168483648673864");
//         expect(JSON.stringify(TestResult)).equals(JSON.stringify(t));
//     });
 }



function testModifyTestResult(id,rfid, newTestResult2, exp){
    test("test update testResult", async () => {
        let resp = await modifyTestResult(id,rfid,newTestResult2);
        expect(resp).equals(undefined);
    });
    test("test for updating added correctly", async () => {
        let TestResult = await getTestResultById(id,rfid);
        expect(JSON.stringify(TestResult)).equals(JSON.stringify(exp));
    });
}

function testDeleteTestResult(id){
    test('test delete TestResult ', async() => {
        let resp = await deleteTestResult(id);
        expect(resp).equals(undefined);
    })


}