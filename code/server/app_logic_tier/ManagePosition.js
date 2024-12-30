
const { db } = require('../database/createDatabase');
const { Position } = require('../data_tier/Position');



async function getAllPosition() {
    const sql = "SELECT * FROM  Position"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((p) => new Position(p.positionID, p.aisleID, p.row, p.col, p.maxVolume, p.maxWeight, p.occupiedVolume, p.occupiedWeight));
                resolve(result);
            }
        })
    });
}

async function getPosition(id) {
    const sql = "SELECT * FROM Position WHERE positionID=?"
    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                if (rows.length === 0) {
                    resolve([]);
                } else {
                    resolve(new Position(rows.positionID, rows.aisleID, rows.row, rows.col, rows.maxWeight, rows.maxVolume, rows.occupiedWeight, rows.occupiedVolume));
                }
            }
        })
    });
}

async function addNewPosition(position) {

    const sql = 'INSERT INTO Position (positionID, aisleID, row, col, maxWeight, maxVolume) VALUES (?, ?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [position.positionID, position.aisleID, position.row, position.col, position.maxWeight, position.maxVolume], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}


async function modifyPosition(id, newposition) {

    const sql = 'UPDATE Position SET positionID = ?, aisleID = ?, row = ?, col = ?,  maxVolume = ?, maxWeight = ?, occupiedVolume = ?, occupiedWeight = ? WHERE positionID = ?';


    return new Promise((resolve, reject) => {
        db.run(sql, [newposition.newAisleID.concat(newposition.newRow).concat(newposition.newCol), newposition.newAisleID, newposition.newRow, newposition.newCol, newposition.newMaxVolume, newposition.newMaxWeight, newposition.newOccupiedVolume, newposition.newOccupiedWeight, id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function modifyPositionID(id, newposition) {

    const sql = 'UPDATE Position SET positionID=?, aisleID=?, row=?, col=? WHERE positionID=?';

    const aisleid = newposition.newPositionID.slice(0, 4);
    const rowid = newposition.newPositionID.slice(4, 8);
    const colid = newposition.newPositionID.slice(8, 12);


    return new Promise((resolve, reject) => {
        db.run(sql, [newposition.newPositionID, aisleid, rowid, colid, id], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deletePosition(id) {

    const sql = 'DELETE FROM Position WHERE positionID=? ';

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


module.exports = { getAllPosition, getPosition, modifyPosition, modifyPositionID, addNewPosition, deletePosition };