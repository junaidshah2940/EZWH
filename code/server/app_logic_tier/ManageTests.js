'use strict'
const { db } = require('../database/createDatabase');
const { TestDescriptor } = require('../data_tier/TestDescriptor');
const { TestResult } = require('../data_tier/TestResult');

async function getAllTestDescriptors() {
    const sql = "SELECT * FROM TestDescriptor "
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((t) => new TestDescriptor(t.id, t.name, t.procedureDescription, t.SKUid));
                resolve(result);
            }
        })
    });

}

async function getTestDescriptorById(id) {
    const sql = "SELECT * FROM TestDescriptor WHERE id=?"
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if (!row) {
                    resolve(undefined);
                } else {
                    resolve(new TestDescriptor(row.id, row.name, row.procedureDescription, row.SKUid));
                }
            }
        })
    });
}

async function addNewTestDescriptor(TestDescriptor) {

    const sql = 'INSERT INTO TestDescriptor(name, procedureDescription, SKUid) VALUES(?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [TestDescriptor.name, TestDescriptor.procedureDescription, TestDescriptor.idSKU], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


async function modifyTestDescriptor(id, newTestDescriptor) {

    const sql = 'UPDATE TestDescriptor SET name=?, procedureDescription=?, SKUid=? WHERE id=?';


    return new Promise((resolve, reject) => {
        db.run(sql, [newTestDescriptor.newName, newTestDescriptor.newProcedureDescription, newTestDescriptor.newIdSKU, id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deleteTestDescriptor(id) {

    const sql = 'DELETE FROM TestDescriptor WHERE id=? ';

    return new Promise((resolve, reject) => {
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}




//Manage TestResults

async function getAllTestResults(rfid) {
    const sql = "SELECT * FROM TestResult WHERE rfid=?  "
    return new Promise((resolve, reject) => {
        db.all(sql, [rfid], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((t) => new TestResult(t.id, t.idTestDescriptor, t.Date, t.Result, t.rfid));
                resolve(result);
            }
        })
    });

}

async function getTestResultById(id, rfid) {
    const sql = "SELECT * FROM TestResult WHERE id=? AND rfid =?"
    return new Promise((resolve, reject) => {
        db.get(sql, [id, rfid], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if(!row){
                    resolve(undefined);
                }
                else{
                resolve(new TestResult(row.id, row.idTestDescriptor, row.Date, row.Result, row.rfid));}
            }
        })
    });
}

async function addNewTestResult(TestResult) {

    const sql = 'INSERT INTO TestResult(rfid,idTestDescriptor, Date, Result) VALUES(?, ?, ?,?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [TestResult.rfid, TestResult.idTestDescriptor, TestResult.Date, TestResult.Result], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


async function modifyTestResult(id, rfid, newTestResult) {

    const sql = 'UPDATE TestResult SET idTestDescriptor=?, Date=?, Result=? WHERE id=? AND rfid =?';


    return new Promise((resolve, reject) => {
        db.run(sql, [newTestResult.newidTestDescriptor, newTestResult.newDate, newTestResult.newResult, id, rfid], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deleteTestResult(id,rfid) {

    const sql = 'DELETE FROM TestResult WHERE id=? AND rfid=?';

    return new Promise((resolve, reject) => {
        db.run(sql, [id,rfid], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}






module.exports = { getAllTestDescriptors, getTestDescriptorById, addNewTestDescriptor, modifyTestDescriptor, deleteTestDescriptor, getAllTestResults, getTestResultById, addNewTestResult, modifyTestResult, deleteTestResult };






