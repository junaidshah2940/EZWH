'use strict'
const { db } = require('../database/createDatabase');
const { SKU } = require('../data_tier/SKU');
const { SKUitem } = require('../data_tier/SKUitem');
const {getPosition} = require('./ManagePosition');

async function getAllSKU() {
    const sql = "SELECT * FROM  SKU"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((s) => new SKU(s.id, s.description, s.weight, s.volume, s.notes, s.positionId, s.availableQuantity, s.price, s.testDescriptorId));
                resolve(result);
            }
        })
    });

}

async function getSKU(id) {
    const sql = "SELECT * FROM SKU WHERE SKU.id=?"
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if(row === undefined){
                    resolve(undefined);
                }
                else
                resolve(new SKU(row.id, row.description, row.weight, row.volume, row.notes, row.positionId, row.availableQuantity, row.price, row.testDescriptorId));
            }
        })
    });
}

async function addNewSKU(sku) {

    const sql = 'INSERT INTO SKU (description, weight, volume, notes, positionID, availableQuantity, price, testDescriptorID) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [sku.description, sku.weight, sku.volume, sku.notes, sku.position, sku.availableQuantity, sku.price, sku.testDescriptors], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function modifySKU(id, newsku) {

    const sql = 'UPDATE SKU  SET description=?, weight=?, volume=?, notes=?, availableQuantity=?, price=?, testDescriptorId=? WHERE id=? ';
    const sql2= 'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'
    let sku = await getSKU(id);
    let pos = await getPosition(sku.position);
    if ((newsku.newWeight * newsku.newAvailableQuantity) > pos.maxWeight || (newsku.newVolume * newsku.newAvailableQuantity) > pos.maxVolume) {
        resolve(-1);
    }
    else {
        return new Promise((resolve, reject) => {
            db.run(sql, [newsku.newDescription, newsku.newWeight, newsku.newVolume, newsku.newNotes, newsku.newAvailableQuantity, newsku.newPrice, newsku.newTestDescriptors,  id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    db.run(sql2, [newsku.newWeight * newsku.newAvailableQuantity, newsku.newVolume * newsku.newAvailableQuantity, sku.position], function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }});
                    
                }
            });
        });
    }
}

async function modifySKUPosition(id, position) {

    const sql = 'UPDATE SKU SET  positionId=? WHERE id=? ';
    const sql2= 'UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=?'

    let sku = await getSKU(id);
    let oldpos;
    try{
        oldpos = await getPosition(sku.position);
    }
    catch(e){
        oldpos = null;
    }
    let pos = await getPosition(position);
    if ((sku.Weight * sku.AvailableQuantity) > pos.maxWeight || (sku.Volume * sku.AvailableQuantity) > pos.maxVolume) {
        return -1;
    }
    else {
        return new Promise((resolve, reject) => {

            db.run(sql, [pos.positionID, id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    db.run(sql2, [sku.weight * sku.availableQuantity, sku.volume * sku.availableQuantity, sku.position], function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                    db.run('UPDATE Position SET occupiedWeight=?, occupiedVolume=? WHERE positionID=? ', [0, 0, oldpos.positionID], function (err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }});
                        }});
                }
            });
        });
    }
}

async function deleteSKU(id) {

    const sql = 'DELETE FROM SKU WHERE id=? ';

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


async function getAllSKUitem() {
    const sql = "SELECT * FROM  SKUItem"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((s) => new SKUitem(s.rfid, s.availability, s.dateOfStock, s.SkuId));
                resolve(result);
            }
        })
    });

}

async function getSKUitemBySKU(id) {
    const sql = "SELECT * FROM SKUItem WHERE SkuId = ? and availability = 1"
    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(rows.map((s) => new SKUitem(s.rfid, s.availability, s.dateOfStock, s.SkuId)));
            }
        })
    });
}


async function getSKUitem(id) {
    const sql = "SELECT * FROM SKUItem WHERE rfid=?"
    return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                if(rows===undefined){
                    resolve(undefined);
                }
                else
                resolve(new SKUitem(rows.rfid, rows.availability, rows.dateOfStock, rows.SkuId));
            }
        })
    });
}


async function addNewSKUitem(skuitem) {

    const sql = 'INSERT INTO SKUItem (rfid, availability, dateOfStock, SkuId) VALUES(?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [skuitem.RFID, 0, skuitem.DateOfStock, skuitem.SKUId], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function modifySKUitem(id, newskuitem) {

    const sql = 'UPDATE SKUItem SET rfid=?, availability=?, dateOfStock=? WHERE rfid=?';


    return new Promise((resolve, reject) => {
        db.run(sql, [newskuitem.newRFID, newskuitem.newAvailable, newskuitem.newDateOfStock, id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deleteSKUitem(rfid) {

    const sql = 'DELETE FROM SKUItem WHERE rfid=? ';

    return new Promise((resolve, reject) => {
        db.run(sql, [rfid], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


module.exports = { getAllSKU, getSKU, addNewSKU, modifySKU, modifySKUPosition, deleteSKU, 
    getAllSKUitem, getSKUitem, getSKUitemBySKU, addNewSKUitem, modifySKUitem, deleteSKUitem};