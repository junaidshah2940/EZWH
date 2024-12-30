'use strict'
const { db } = require('../database/createDatabase');
const { User } = require('../data_tier/User');



async function getAllSuppliers() {
    const sql = "SELECT * FROM  User WHERE Type = 'supplier'"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((u) => new User(u.id, u.email, u.password, u.name, u.surname, u.type));
                resolve(result);
            }
        })
    });
}


async function getAllUsers() {
    const sql = "SELECT * FROM  User WHERE Type != 'manager'"
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            }
            else {
                const result = rows.map((u) => new User(u.id, u.email, u.password, u.name, u.surname, u.type));
                resolve(result);
            }
        })
    });
}


async function getUser(un, type) {
    const sql = "SELECT * FROM User WHERE User.email=? AND User.type=?";
 
    return new Promise((resolve, reject) => {
        db.get(sql, [un, type], (err, row) => {
            if (err) {
                reject(err);
            }
            else {
                if(row === undefined){
                    resolve(undefined);
                }
                else
                resolve(new  User(row.id, row.email, row.password, row.name, row.surname, row.type));
            }
        })
    });
}

async function addNewUser(user) {

    const sql = 'INSERT INTO User(email, password, name, surname, type) VALUES(?, ?, ?, ?, ?)';

    return new Promise((resolve, reject) => {
        db.run(sql, [ user.username, user.password, user.name, user.surname, user.type], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function modifyUser(un, types) {

    const sql = 'UPDATE User SET type=? WHERE User.email=? and User.type=?';


    return new Promise((resolve, reject) => {
        db.run(sql, [types.newType,  un, types.oldType], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

async function deleteUser(un, type) {

    const sql = 'DELETE FROM User WHERE email=? and type=? ';

    return new Promise((resolve, reject) => {
        db.run(sql, [un, type], function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

module.exports = { getAllUsers, getAllSuppliers, getUser, modifyUser, addNewUser , deleteUser};