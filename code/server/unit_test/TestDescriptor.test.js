const { expect } = require('chai');
const  {  getAllTestDescriptors, getTestDescriptorById, addNewTestDescriptor, modifyTestDescriptor, deleteTestDescriptor }= require('../app_logic_tier/ManageTests');
const { TestDescriptor } = require('../data_tier/TestDescriptor');

const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});


function nTestDescriptor(id,name, procedureDescription,SKUid ) {
  
    this.id = id;
    this.newName = name;
    this.newProcedureDescription = procedureDescription;
    this.newSKUid = SKUid;

}



const allTestDescriptors= [
    new TestDescriptor(1,"test1","spegni e riaccendi",1),
    new TestDescriptor(2,"test2","uguale a prima",1),
    new TestDescriptor(3,"test3","stacca e riattacca",2 ),
    new TestDescriptor(4,"test4","stacca stacca",3 )
]

 
testGetAllTestDescriptors(allTestDescriptors);

const expTestDescriptor = new TestDescriptor(4,"test4","stacca stacca",3);

testGetTestDescriptor(expTestDescriptor);

const newTestDescriptor = new TestDescriptor(5,"test5", "Maniglia",2);

testCreateTestDescriptor(newTestDescriptor);

const newTestDescriptor2 = new nTestDescriptor(5,"test5","Maniglia",2);
const newTestDescriptor2exp = new TestDescriptor(5,"test5","Maniglia",2);
testModifyTestDescriptor(newTestDescriptor.id, newTestDescriptor2, newTestDescriptor2exp)

testDeleteTestDescriptor(newTestDescriptor.id);

function testGetAllTestDescriptors(expectedOutput) {

    test('test get all test descriptors', async () => {
        let TestDescriptor = await getAllTestDescriptors();
        expect(JSON.stringify(TestDescriptor)).equals(JSON.stringify(expectedOutput));
    })
}


function testGetTestDescriptor(expectedOutput) {
    test('test get testdescriptors by id', async () => {
        let TestDescriptor = await getTestDescriptorById(4);
        expect(JSON.stringify(TestDescriptor)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreateTestDescriptor(i){
    test("test adding new testDescriptor", async () => {
        let resp = await addNewTestDescriptor(i);
        expect(resp).equals(undefined);
    });
    }

function testModifyTestDescriptor(id, newTestDescriptor, exp){
    test("test update testDescriptor", async () => {
        let resp = await modifyTestDescriptor(id,newTestDescriptor);
        expect(resp).equals(undefined);
    });
    test("test for updating TestDescriptor added correctly", async () => {
        let TestDescriptor = await getTestDescriptorById(id);
        expect(JSON.stringify(TestDescriptor)).equals(JSON.stringify(exp));
    });
}

function testDeleteTestDescriptor(id){
    test('test delete a test descriptor given the id', async() => {
        let resp = await deleteTestDescriptor(id);
        expect(resp).equals(undefined);
    })


}