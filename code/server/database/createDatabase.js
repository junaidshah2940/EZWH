const sqlite = require('sqlite3');
const path = require('path');
const { isPrimitive } = require('util');
const { ok } = require('assert');
const { table } = require('console');

const db = new sqlite.Database('ezwh.db', (err) => {
    if (err) throw err;
})

//this script creates the database and all the tables inside the database ezwh.db
function createTables() {

    db.serialize(() => {
        const internalOrders = 'CREATE TABLE IF NOT EXISTS "InternalOrder" ( "state"	TEXT NOT NULL, "id"	INTEGER NOT NULL, "supplierId"	TEXT, "date"	TEXT NOT NULL, "customerId"	INTEGER NOT NULL, "from" TEXT, PRIMARY KEY("id" AUTOINCREMENT));'

        db.run(internalOrders, (err) => {
            if (err) {
                throw err;
            }
        })

        const internalOrdersSKU = 'CREATE TABLE IF NOT EXISTS "InternalOrderSKU" ("lineId" INTEGER, "internalOrderId"	INTEGER NOT NULL, "SKUId"	INTEGER NOT NULL, "quantity"	INTEGER NOT NULL, PRIMARY KEY("lineId" AUTOINCREMENT), FOREIGN KEY("SKUId") REFERENCES "SKU"("id"), FOREIGN KEY("internalOrderId") REFERENCES "InternalOrder"("id"));'

        db.run(internalOrdersSKU, (err) => {
            if (err) {
                throw err;
            }
        })

        const item = 'CREATE TABLE IF NOT EXISTS "Item" ( "id"	INTEGER NOT NULL, "description"	TEXT, "SKUid"	INTEGER NOT NULL, "supplierId"	INTEGER NOT NULL, "price"	INTEGER NOT NULL, PRIMARY KEY("id"));'

        db.run(item, (err) => {
            if (err) {
                throw err;
            }
        })

        const position = 'CREATE TABLE IF NOT EXISTS "Position" ("positionID"	TEXT NOT NULL, "aisleID" TEXT NOT NULL, "row"	TEXT NOT NULL, "col"	TEXT NOT NULL, "maxVolume"	REAL NOT NULL, "maxWeight"	REAL NOT NULL, "occupiedVolume"	REAL, "occupiedWeight"	REAL, PRIMARY KEY("positionID"));'

        db.run(position, (err) => {
            if (err) {
                throw err;
            }
        })

        const restockOrders = 'CREATE TABLE IF NOT EXISTS "RestockOrder" ("id"	INTEGER NOT NULL,"state"	TEXT NOT NULL,"supplierId"	INTEGER NOT NULL,"issueDate"	TEXT NOT NULL,"trasportNote"	TEXT, PRIMARY KEY("id" AUTOINCREMENT));'


        db.run(restockOrders, (err) => {
            if (err) {
                throw err;
            }
        })

        const restockOrderItem = 'CREATE TABLE IF NOT EXISTS "RestockOrderItem" ("lineID"	INTEGER,"restockOrderId"	INTEGER,"itemId"	INTEGER,"supplierId"	INTEGER,"quantity"	INTEGER, "SKUId" INTEGER ,FOREIGN KEY("restockOrderId") REFERENCES "RestockOrder"("id"),FOREIGN KEY("itemId") REFERENCES "Item"("id"),PRIMARY KEY("lineID" AUTOINCREMENT));'

        db.run(restockOrderItem, (err) => {
            if (err) {
                throw err;
            }
        })

        const restockOrdersSKU = 'CREATE TABLE IF NOT EXISTS "RestockOrderSKU" ("lineId" INTEGER, "restockOrderId"	INTEGER,"itemId" INTEGER,"SKUid" INTEGER, "rfid"	TEXT,FOREIGN KEY("restockOrderId") REFERENCES "RestockOrder"("id"),PRIMARY KEY("lineId" AUTOINCREMENT));'

        db.run(restockOrdersSKU, (err) => {
            if (err) {
                throw err;
            }
        })

        const returnOrders = 'CREATE TABLE IF NOT EXISTS "ReturnOrder" ("id"	INTEGER,"restockOrderId"	INTEGER NOT NULL,"returnDate"	TEXT,PRIMARY KEY("id" AUTOINCREMENT),FOREIGN KEY("restockOrderId") REFERENCES "RestockOrder"("id"));'

        db.run(returnOrders, (err) => {
            if (err) {
                throw err;
            }
        })

        const returnOrderSKUItem = 'CREATE TABLE IF NOT EXISTS "ReturnOrderSKUItem" ( "lineID"	INTEGER, "rfid"	TEXT, "returnOrderId"	INTEGER, "skuId"	INTEGER, "itemId"	INTEGER, FOREIGN KEY("returnOrderId") REFERENCES "ReturnOrder"("id"), FOREIGN KEY("rfid") REFERENCES "SKUItem"("rfid"), FOREIGN KEY("skuId") REFERENCES "SKU"("id"), PRIMARY KEY("lineID"));'

        db.run(returnOrderSKUItem, (err) => {
            if (err) {
                throw err;
            }
        })

        const sku = 'CREATE TABLE IF NOT EXISTS "SKU" ("id"	INTEGER NOT NULL UNIQUE,"description"	TEXT NOT NULL,"weight"	INTEGER NOT NULL,"volume"	INTEGER NOT NULL,"notes"	TEXT,"positionId" INTEGER,"availableQuantity"	INTEGER NOT NULL,"price"	REAL NOT NULL,"testDescriptorId"	INTEGER,PRIMARY KEY("id" AUTOINCREMENT));'

        db.run(sku, (err) => {
            if (err) {
                throw err;
            }
        })

        const skuItems = 'CREATE TABLE IF NOT EXISTS "SKUItem" ("rfid"	TEXT NOT NULL UNIQUE,"availability"	INTEGER NOT NULL,"dateOfStock"	TEXT,"SkuId"	INTEGER,PRIMARY KEY("rfid"),FOREIGN KEY("SkuId") REFERENCES "SKU"("id"));'

        db.run(skuItems, (err) => {
            if (err) {
                throw err;
            }
        })

        const testDescriptor = 'CREATE TABLE IF NOT EXISTS "TestDescriptor" ("id"	INTEGER NOT NULL,"procedureDescription"	TEXT,"name"	TEXT,"SKUid"	INTEGER,PRIMARY KEY("id" AUTOINCREMENT));'

        db.run(testDescriptor, (err) => {
            if (err) {
                throw err;
            }
        })

        const testResult = 'CREATE TABLE IF NOT EXISTS "TestResult" ("id"	INTEGER NOT NULL,"idTestDescriptor"	INTEGER,"Date"	TEXT,"Result"	TEXT,"rfid"	TEXT,PRIMARY KEY("id" AUTOINCREMENT),FOREIGN KEY("rfid") REFERENCES "SKUItem"("rfid"));'

        db.run(testResult, (err) => {
            if (err) {
                throw err;
            }
        })

        const user = 'CREATE TABLE IF NOT EXISTS "User" ("id"	INTEGER NOT NULL,"email"	TEXT NOT NULL,"password"	TEXT NOT NULL,"name"	TEXT NOT NULL,"surname"	TEXT NOT NULL,"type"	TEXT NOT NULL,PRIMARY KEY("id" AUTOINCREMENT));'

        db.run(user, (err) => {
            if (err) {
                throw err;
            }
        })
    })
}

function insertusers() {

    db.serialize(() => {
        const insertUsers = "insert into User (email,password,name,surname,type)VALUES('user1@ezwh.com','testpassword','customer','customer','customer')"

        db.run(insertUsers, (err) => {
            if (err) {
                throw err;
            }
        })

        const insertUser1 = "insert into User (email,password,name,surname,type) values('qualityEmployee1@ezwh.com','testpassword', 'quality', 'employee', 'quality employee')"

        db.run(insertUser1, (err) => {
            if (err) {
                throw err;
            }
        })

        const insertUser2 = "insert into User (email,password,name,surname,type) VALUES ('deliveryEmployee1@ezwh.com','testpassword', 'delivery', 'delivery', 'delivery employee')"

        db.run(insertUser2, (err) => {
            if (err) {
                throw err;
            }
        })

        const insertUser3 = "insert into User (email,password,name,surname,type) values ('supplier1@ezwh.com','testpassword','supplier','supplier','supplier')"

        db.run(insertUser3, (err) => {
            if (err) {
                throw err;
            }
        })

        const insertUser4 = "insert into User (email,password,name,surname,type) values ('manager1@ezwh.com', 'testpassword', 'manager', 'manager', 'manager')"

        db.run(insertUser4, (err) => {
            if (err) {
                throw err;
            }
        })
    })
}

async function deleteAllTables() {
    const sql = "DROP TABLE "
    const tables = ["Position",
        "SKUItem",
        "SKU",
        "item",
        "TestDescriptor",
        "TestResult",
        "InternalOrderSKU",
        "RestockOrderItem",
        "RestockOrderSKU",
        "ReturnOrderSKUItem",
        "RestockOrder",
        "ReturnOrder",
        "InternalOrder",
        "User",
        "sqlite_sequence"];
    return new Promise((resolve, reject) => {

        db.serialize(() => {
            tables.forEach((tbl) => {
                db.run(sql + tbl, (err) => {
                    if (err) {
                        reject(err);
                    }
                })
            })
            resolve('ok');
        })
    })
}

async function createDatabase() {

    return new Promise((resolve, reject) => {
        try {

            createTables();

            setTimeout(() => {

                insertusers();

            }, 1000);

            resolve('ok')
        } catch (error) {
            reject(error);
        }

    })
};


async function deleteDatabase() {
    return new Promise((resolve, reject) => {
        try {
            deleteAllTables().then(() => {
                resolve('ok');
            })
        } catch (error) {
            reject(error);
        }
    })
}


//deleteDatabase().then((result) => { console.log(result) });

module.exports = { db, createDatabase, deleteDatabase }