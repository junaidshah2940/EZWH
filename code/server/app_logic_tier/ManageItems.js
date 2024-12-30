
const { db } = require('../database/createDatabase');
const { Item } = require('../data_tier/Item');



async function getAllItem() {
    const sql = "SELECT * FROM  Item"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((s) => new Item(s.id, s.description, s.SKUid, s.supplierId, s.price));
                resolve(result);
            }
        })
    });

}

async function getItem(id, supplier) {
    const sql = "SELECT * FROM Item WHERE Item.id=? and Item.supplierId=?"
    return new Promise((resolve, reject) => {
        db.get(sql, [id, supplier], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                if(rows===undefined){
                    resolve(undefined);
                }
                else
                resolve(new Item(rows.id, rows.description, rows.SKUid, rows.supplierId, rows.price));

            }
        })
    });
}

async function addNewItem(item) {

    const sql = 'INSERT INTO Item (id, description, SKUid, supplierId, price) VALUES(?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.all(sql, [item.id, item.description,  item.SKUId,  item.supplierId, item.price], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


async function modifyItem(id, newitem, supplier) {

    const sql = 'UPDATE Item SET description = ?, price = ? WHERE Item.id = ? and Item.supplierId=?';


    return new Promise((resolve, reject) => {
        db.run(sql, [newitem.newDescription, newitem.newPrice,  id, supplier], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deleteItem(id, supplier) {

    const sql = 'DELETE FROM Item WHERE id=? and supplierId=?';

    return new Promise((resolve, reject) => {
        db.run(sql, [id, supplier], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


module.exports = { getAllItem, getItem, modifyItem, addNewItem, deleteItem};