'use strict'
const { expect } = require('chai');
const  {getAllUsers, getAllSuppliers, getUser, modifyUser, addNewUser , deleteUser} = require('../app_logic_tier/ManageUsers');
const { User } = require('../data_tier/User');
  

const { db, createDatabase, deleteDatabase }=require('../database/createDatabase')
beforeAll(()=>{
    return createDatabase();
});

afterAll(()=>{
    return deleteDatabase();
});

function nUser(ID, email, password, name, surname, type) {
    this.newID = ID;
    this.newEmail = email;
    this.newPassword = password;
    this.newName= name;
    this.newSurname=surname;
    this.newType=type;
}


const expUsers=[ 
    new User(1, 'user1.ezwh.com','testpassword','customer','customer','customer'),
    new User(2,'qualityEmployee1@ezwh.com','testpassword', 'quality', 'employee', 'quality employee'),
    new User(3,'deliveryEmployee1@ezwh.com','testpassword', 'delivery', 'delivery', 'delivery employee'),
    new User(4, 'supplier1@ezwh.com','testpassword','supplier','supplier','supplier')    
]
testGetAllUser(expUsers);

const newUser = new User(6, "gabriele@email.it", "999", "Gabriele", "Sambin", "supplier");
const newUser1 = {
id : 6,    
username:"gabriele@email.it",
name:"Gabriele",
surname : "Sambin",
password : "999",
type : "supplier"}
testCreateUser(newUser1);

const expSuppli=[
    new User(6, "gabriele@email.it", "999", "Gabriele", "Sambin", "supplier"),
    new User(4, 'supplier1@ezwh.com','testpassword','supplier','supplier','supplier')   
]
testGetAllSuppliers(expSuppli);

const types = {  
    oldType : "supplier",
    newType : "clerk",
};

const newUser2exp = new User(6, "gabriele@email.it", "999", "Gabriele", "Sambin", "clerk");
testModifyUser(newUser, types, newUser2exp);


testGetUser(newUser2exp);

testDeleteUser(newUser2exp.email, newUser2exp.type);

function testGetAllUser(expectedOutput) {

    test('test get all Users', async () => {
        let Users = await getAllUsers();
        expect(JSON.stringify(Users)).equals(JSON.stringify(expectedOutput));
    })
}
function testGetAllSuppliers(expectedOutput) {

    test('test get all Users', async () => {
        let Users = await getAllSuppliers();
        expect(JSON.stringify(Users)).equals(JSON.stringify(expectedOutput));
    })
}


function testGetUser(expectedOutput) {

    test('test get User by id', async () => {
        let User = await getUser(expectedOutput.email, expectedOutput.type);
        expect(JSON.stringify(User)).equals(JSON.stringify(expectedOutput));
    })
}

function testCreateUser(u){
    test("test add new User", async () => {
        let resp = await addNewUser(u);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let User = await getUser(u);
        expect(JSON.stringify(User)).equals(JSON.stringify(i));
    });
}

function testModifyUser(olduser, types, exp){
    test("test update User", async () => {
        let resp = await modifyUser(olduser.email, types);
        expect(resp).equals(undefined);
    });
    test("test added correctly", async () => {
        let User = await getUser(exp.email, exp.type);
        expect(JSON.stringify(User)).equals(JSON.stringify(exp));
    });
}

function testDeleteUser(un, type){
    test('test delete an User given the id', async() => {
        let resp = await deleteUser(un, type);
        expect(resp).equals(undefined);
    })


}