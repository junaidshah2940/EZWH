const { ReturnOrder } = require('../data_tier/ReturnOrder');
const { db } = require('../database/createDatabase');
const { removeDuplicatesSKU } = require('./service');

function TempOrder(id, issueDate, state, SkuId, description, price, quantity, supplierId, trasportNote, rfid, itemId) {
    this.id = id,
        this.issueDate = issueDate,
        this.state = state,
        this.SkuId = SkuId,
        this.description = description,
        this.price = price,
        this.quantity = quantity,
        this.supplierId = supplierId,
        this.trasportNote = trasportNote,
        this.rfid = rfid,
        this.itemId = itemId
}

function TempInternalOrder(id, dateOfStock, state, SkuId, description, price, quantity, customerId, rfid) {
    this.id = id,
        this.dateOfStock = dateOfStock,
        this.state = state,
        this.SkuId = SkuId,
        this.description = description,
        this.price = price,
        this.quantity = quantity,
        this.customerId = customerId,
        this.rfid = rfid
}

function TempReturnOrder(id, restockOrderId, returnDate, SkuId, description, price, quantity, rfid, itemId) {
    this.id = id,
        this.restockOrderId = restockOrderId,
        this.returnDate = returnDate,
        this.SkuId = SkuId,
        this.description = description,
        this.price = price,
        this.quantity = quantity,
        this.rfid = rfid,
        this.itemId = itemId
}

async function getAllRestockOrders() {

    const sql = 'SELECT RestockOrder.id as restockOrderId, issueDate, state, Item.SKUid as SkuId, Item.id as itemId, Item.description, Item.price, quantity, RestockOrder.supplierId, trasportNote, rfid FROM restockorder LEFT join RestockOrderItem on (restockorder.id =  RestockOrderItem.restockOrderId) LEFT JOIN Item on (RestockOrderItem.itemId = Item.id) LEFT JOIN SKUItem on (Item.SKUid = SKUItem.SkuId)';

    return new Promise((resolve, reject) => {

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempOrder(orders.restockOrderId, orders.issueDate, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity, orders.supplierId, JSON.parse(orders.trasportNote), orders.rfid, orders.itemId)
                    )
                )
            }
        })
    }
    )
}

async function getIssuedRestockOrders() {

    const sql = "SELECT RestockOrder.id as restockOrderId, issueDate, state, Item.SKUid as SkuId, Item.id as itemId, Item.description, Item.price, quantity, RestockOrder.supplierId, trasportNote, rfid FROM restockorder LEFT join RestockOrderItem on (restockorder.id =  RestockOrderItem.restockOrderId) LEFT JOIN Item on (RestockOrderItem.itemId = Item.id) LEFT JOIN SKUItem on (Item.SKUid = SKUItem.SkuId) where RestockOrder.state = 'ISSUED'";

    return new Promise((resolve, reject) => {

        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempOrder(orders.restockOrderId, orders.issueDate, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.supplierId, JSON.parse(orders.trasportNote), orders.rfid, orders.itemId)
                    )
                )
            }
        })
    }
    )
}

async function getRestockOrdersById(id) {

    const sql = "SELECT RestockOrder.id as restockOrderId, issueDate, state, Item.SKUid as SkuId, Item.id as itemId, Item.description, Item.price, quantity, RestockOrder.supplierId, trasportNote, rfid FROM restockorder LEFT join RestockOrderItem on (restockorder.id =  RestockOrderItem.restockOrderId) LEFT JOIN Item on (RestockOrderItem.itemId = Item.id) LEFT JOIN SKUItem on (Item.SKUid = SKUItem.SkuId) where RestockOrder.id = ?"

    return new Promise((resolve, reject) => {

        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempOrder(orders.restockOrderId, orders.issueDate, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.supplierId, JSON.parse(orders.trasportNote), orders.rfid, orders.itemId)
                    )
                )
            }
        })
    }
    )
}


async function getItemsFromRestockOrderById(id) {

    const sql = "SELECT Item.SKUid, Item.id as itemId, TestResult.rfid FROM restockorder join RestockOrderItem on (restockorder.id =  RestockOrderItem.restockOrderId) JOIN Item on (RestockOrderItem.itemId = Item.id) JOIN TestDescriptor on (Item.SKUid = TestDescriptor.SKUid)Join TestResult on (TestDescriptor.id = TestResult.idTestDescriptor)where RestockOrder.id = ? and TestResult.Result = 'false'"

    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((item) =>
                        new TempOrder(undefined, undefined, undefined, item.SKUid, undefined, undefined, undefined, undefined, undefined, item.rfid, item.itemId))
                )
            }
        }
        )
    }
    )
}

async function createRestockOrder(ro) {

    const sql = 'INSERT INTO RestockOrder (state,supplierId,issueDate) VALUES (?,?,?)'


    db.all(sql, ['ISSUED', ro.supplierId, ro.issueDate], (err, rows) => {
        if (err) {
            throw err;
        }
    })

    let lastIdVector = await getLastRestockOrderId();
    let lastId = lastIdVector[0].id;

    const products = 'INSERT INTO RestockOrderItem (restockOrderId, itemId, supplierId, quantity, SKUId) VALUES (?,?,?,?,?)'
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            ro.products.forEach((product) => {
                db.all(products, [lastId, product.itemId, ro.supplierId, product.qty, product.SKUId], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                })
            })
        })
        resolve('ok');
    });
}


async function getLastRestockOrderId() {

    const sql = "select rowid from RestockOrder ORDER by rowid DESC limit 1";
    // const sql = 'select seq from sqlite_sequence where name="RestockOrder"'
    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    });
}

async function updateStatus(orderId, newState) {

    const sql = 'UPDATE RestockOrder set state = ? where RestockOrder.id = ?';
    return new Promise((resolve, reject) => {
        db.all(sql, [newState, orderId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

}

async function setRestockOrderSKUItems(id, newSKUItems) {

    // const sql = 'insert into SKUItem (rfid, SkuId, availability) VALUES (?,?,1)';

    // newSKUItems.forEach((skuitem) => {
    //     db.all(sql, [skuitem.rfid, skuitem.SKUId], (err, rows) => {
    //         if (err) {
    //             throw err;
    //         }
    //     })
    // })

    const sql1 = 'insert into RestockOrderSKU (restockOrderId, rfid , SKUid, itemId) values(?,?,?,?)';

    newSKUItems.forEach((sku) => {
        db.all(sql1, [id, sku.rfid, sku.SKUId, sku.itemId], (err, rows) => {
            if (err) {
                throw err;
            }
        })
    });

}


async function setTrasportNoteRestockOrder(orderId, trasportNote) {

    const sql = "UPDATE RestockOrder set trasportNote = ? where RestockOrder.id = ?"

    return new Promise((resolve, reject) => {
        db.all(sql, [trasportNote, orderId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

}

async function deleteRestockOrder(id) {

    const sql = 'DELETE from RestockOrderItem where RestockOrderItem.restockOrderId = ?'

    db.all(sql, [id], (err, rows) => {
        if (err) {
            throw err;
        }
    })

    const sql1 = 'DELETE from RestockOrder where RestockOrder.id = ?';

    return new Promise((resolve, reject) => {
        db.all(sql1, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

}


async function getAllInternalOrders() {

    const sql = 'SELECT InternalOrder.id, InternalOrder.date, state, SKUItem.SkuId, description, price, quantity, InternalOrder.customerId, rfid FROM InternalOrder LEFT JOIN InternalOrderSKU ON (InternalOrder.id = InternalOrderSKU.internalOrderId) LEFT JOIN SKU ON (InternalOrderSKU.SkuId = SKU.id) LEFT JOIN SKUItem ON (SKU.id = SKUItem.SkuId)'

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempInternalOrder(orders.id, orders.date, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.customerId, orders.rfid)

                    )
                )
            }
        })
    }

    )

}


async function getIssuedInternalOrder() {

    const sql = "SELECT InternalOrder.id,dateOfStock , state, SKUItem.SkuId, description, price, quantity, InternalOrder.customerId, rfid FROM InternalOrder LEFT JOIN InternalOrderSKU ON (InternalOrder.id = InternalOrderSKU.internalOrderId) LEFT JOIN SKU ON (InternalOrderSKU.SkuId = SKU.id) LEFT JOIN SKUItem ON (SKU.id = SKUItem.SkuId) where InternalOrder.state = 'ISSUED'"

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempInternalOrder(orders.id, orders.dateOfStock, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.customerId, orders.rfid)

                    )
                )
            }
        })
    }

    )
}

async function getAcceptedInternalOrder() {

    const sql = "SELECT InternalOrder.id,dateOfStock , state, SKUItem.SkuId, description, price, quantity, InternalOrder.customerId, rfid FROM InternalOrder LEFT JOIN InternalOrderSKU ON (InternalOrder.id = InternalOrderSKU.internalOrderId) LEFT JOIN SKU ON (InternalOrderSKU.SkuId = SKU.id) LEFT JOIN SKUItem ON (SKU.id = SKUItem.SkuId) where InternalOrder.state = 'ACCEPTED'"

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempInternalOrder(orders.id, orders.dateOfStock, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.customerId, orders.rfid)

                    )
                )
            }
        })
    }

    )
}

async function getInternalOrderById(id) {

    const sql = 'SELECT InternalOrder.id,dateOfStock , state, SKUItem.SkuId, description, price, quantity, InternalOrder.customerId, rfid FROM InternalOrder LEFT JOIN InternalOrderSKU ON (InternalOrder.id = InternalOrderSKU.internalOrderId) LEFT JOIN SKU ON (InternalOrderSKU.SkuId = SKU.id) LEFT JOIN SKUItem ON (SKU.id = SKUItem.SkuId) where InternalOrder.id = ?'

    return new Promise((resolve, reject) => {

        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((orders) =>
                        new TempInternalOrder(orders.id, orders.dateOfStock, orders.state, orders.SkuId, orders.description, orders.price, orders.quantity,
                            orders.customerId, orders.rfid))
                )
            }
        })

    })
}

async function createInternalOrder(internalOrder) {

    const sql = 'INSERT INTO InternalOrder (state,customerId,date) VALUES (?,?,?)'

    db.all(sql, [internalOrder.state, internalOrder.customerId, internalOrder.date], (err, rows) => {
        if (err) {
            throw err;
        }
    })

    let lastIdVector = await getLastInternalOrder();
    let lastId = lastIdVector[0].id;

    const products = 'INSERT INTO InternalOrderSKU (internalOrderId, quantity, SKUid) VALUES (?,?,?)'

    db.serialize(() => {
        internalOrder.products.forEach((product) => {
            db.all(products, [lastId, product.qty, product.SKUId], (err, rows) => {
                if (err) {
                    throw err;
                }
            })
        }
        )
    })
}

async function getLastInternalOrder() {

    const sql = 'SELECT id from InternalOrder ORDER by id desc limit 1'

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

async function updateInternalOrder(orderId, newState, products) {

    let productsQuery = undefined;
    const sql = "update InternalOrder set state = ? where InternalOrder.id = ?";

    if (newState === 'COMPLETED') {
        productsQuery = "insert into SKUItem (SkuId, rfid, availability) values (?,?,1)";
    }


    db.all(sql, [newState, orderId], (err, rows) => {
        if (err) {
            throw err;
        }
    })

    if (productsQuery) {
        db.serialize(() => {
            products.forEach((element) => {
                db.all(productsQuery, [element.SkuID, element.RFID], (err, rows) => {
                    if (err) {
                        throw err;
                    }
                })
            }
            )
        })
    }
    return 'ok';
}


async function deleteInternalOrder(orderId) {

    const sql = 'DELETE from InternalOrderSKU where InternalOrderSKU.internalOrderId = ?'

    let delete1 = await new Promise((resolve, reject) => {
        db.all(sql, [orderId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

    const sql1 = 'DELETE from InternalOrder where InternalOrder.id = ?';

    return new Promise((resolve, reject) => {
        db.all(sql1, [orderId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

}


async function getAllReturnOrder() {

    const sql = "SELECT ReturnOrder.id as ReturnOrderId, RestockOrder.id as RestockOrderId, returnDate, RestockOrderSKU.SKUid, SKU.description, price, RestockOrderSKU.itemId, RestockOrderSKU.rfid FROM ReturnOrder LEFT JOIN RestockOrder ON (ReturnOrder.restockOrderId = RestockOrder.id)  LEFT JOIN RestockOrderSKU on (RestockOrder.id = RestockOrderSKU.restockOrderId) join SKU  on (RestockOrderSKU.SKUid = sku.id)";

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((order) =>
                        new TempReturnOrder(order.ReturnOrderId, order.RestockOrderId, order.returnDate, order.SKUid, order.description, order.price, undefined, order.rfid, order.itemId)
                    )
                )
            }
        })
    })
}

async function getReturnOrderById(id) {


    const sql = "SELECT ReturnOrder.id as ReturnOrderId, RestockOrder.id as RestockOrderId, returnDate, RestockOrderSKU.SKUid, SKU.description, price, RestockOrderSKU.itemId, RestockOrderSKU.rfid FROM ReturnOrder LEFT JOIN RestockOrder ON (ReturnOrder.restockOrderId = RestockOrder.id)  LEFT JOIN RestockOrderSKU on (RestockOrder.id = RestockOrderSKU.restockOrderId) join SKU  on (RestockOrderSKU.SKUid = sku.id) where ReturnOrderId = ?"

    return new Promise((resolve, reject) => {
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(
                    rows.map((order) =>
                        new TempReturnOrder(order.ReturnOrderId, order.RestockOrderId, order.returnDate, order.SKUid, order.description, order.price, undefined, order.rfid, order.itemId)
                    )
                )
            }
        })
    })
}

async function getLastReturnOrderId() {

    const sql = 'Select id from ReturnOrder order by id desc limit 1';

    return new Promise((resolve, reject) => {
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        })
    })
}

async function createReturnOrder(reo) {

    const sql = 'insert into ReturnOrder (RestockOrderId, returnDate) values (?,?)'

    new Promise((resolve, reject) => {
        db.all(sql, [reo.restockOrderId, reo.returnDate], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve('ok');
            }
        })
    })

    let lastIdVector = await getLastReturnOrderId();
    let lastId = lastIdVector[0].id;

    const product = 'insert into ReturnOrderSKUItem (rfid,returnOrderId,skuId,itemId) values(?,?,?,?)';

    db.serialize(() => {
        reo.products.forEach(element => {
            db.all(product, [element.RFID, lastId, element.SKUId, element.itemId], (err, rows) => {
                if (err) {
                    throw (err);
                }
            })
        })
    })

}


async function deleteReturnOrder(id) {

    const sql = 'delete from ReturnOrderSKUItem where returnOrderId = ?'

    db.all(sql, [id], (err, rows) => {
        if (err) {
            throw err;
        }
    })

    const sql1 = 'delete from ReturnOrder where id = ?'

    db.all(sql1, [id], (err, rows) => {
        if (err) {
            throw err;
        }
    })
}

module.exports = {
    getAllRestockOrders,
    getIssuedRestockOrders,
    getRestockOrdersById,
    getItemsFromRestockOrderById,
    createRestockOrder,
    updateStatus,
    setRestockOrderSKUItems,
    setTrasportNoteRestockOrder,
    deleteRestockOrder,
    getLastRestockOrderId,
    getAllInternalOrders,
    getIssuedInternalOrder,
    getAcceptedInternalOrder,
    getInternalOrderById,
    createInternalOrder,
    updateInternalOrder,
    deleteInternalOrder,
    getAllReturnOrder,
    getReturnOrderById,
    createReturnOrder,
    deleteReturnOrder,
    getLastReturnOrderId,
    TempOrder,
    TempInternalOrder,
    TempReturnOrder
};