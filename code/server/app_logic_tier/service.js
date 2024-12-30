const { RestockOrder } = require("../data_tier/RestockOrder");
const { InternalOrder } = require("../data_tier/InternalOrder")
const { SKU } = require("../data_tier/SKU");
const { SKUitem } = require("../data_tier/SKUitem");
const { Item } = require("../data_tier/Item");
const { ReturnOrder } = require("../data_tier/ReturnOrder");
const { db } = require('../database/createDatabase');

function removeDuplicates(Ro) {
    let id = 0;
    let ret = [];
    Ro.forEach((element) => {

        if (element.id !== id) {
            ret.push(element);
            id = element.id
        }

    });

    return ret;
}

function removeDuplicatesSKU(SKUItems) {
    let id = 0;
    let ret = [];
    SKUItems.forEach((element) => {

        if (element.SKUId !== id) {

            id = element.SKUId;
            const sku_quantity = {
                
                    sku : element,
                    itemId : element.itemId,

            }
            ret.push(sku_quantity);
        }

    });

    return ret;
}


function restockOrderElaborate(orderVec) {

    let response = [];

    let id = 0;

    orderVec.forEach((element) => {

        if (element.id !== id) {

            let responseItem = new RestockOrder(element.state, element.id, [], element.supplierId, element.issueDate, [], (element.state != 'ISSUED') ? element.trasportNote : undefined);
            orderVec.forEach((inner) => {

                let innerSKU = [];
                let innerItem = [];

                if (inner.SkuId !== null) {
                    innerSKU = new Item(inner.itemId, inner.description, inner.SkuId, inner.supplierId, inner.price, inner.quantity);
                }
                if (inner.rfid !== null) {
                    innerItem = new SKUitem(inner.rfid, undefined, undefined, inner.SkuId, inner.itemId);
                }
                if (element.id == inner.id) {
                    responseItem.products = responseItem.products.concat(innerSKU);
                    responseItem.SKUItems = (element.state === 'ISSUED' || element.state === 'DELIVERY') ? [] : responseItem.SKUItems.concat(innerItem);
                }

            })
            response.push(responseItem);
            id = element.id;
        }
    });

    response.forEach((element) => {
        element.products = removeDuplicates(element.products);
    });

    return response;

}


function internalOrderElaborate(orderVec) {

    let response = [];

    let id = 0;

    orderVec.forEach((element) => {

        if (element.id !== id) {

            let responseItem = new InternalOrder(element.state, element.id, [], element.dateOfStock, undefined , element.customerId);
            orderVec.forEach((inner) => {

                let innerSKU = [];
                let innerItem = [];

                if (inner.SkuId !== null) {
                    innerSKU = new SKU(inner.SKUid, inner.description, undefined, undefined, undefined, undefined, inner.quantity, inner.price, undefined);
                }
                if (inner.rfid !== null) {
                    innerItem = new SKUitem(inner.rfid, undefined, undefined, inner.SkuId);
                }
                if (element.id == inner.id) {
                    responseItem.products = (element.state !== 'COMPLETED') ? responseItem.products.concat(innerSKU) : responseItem.products.concat(innerItem);
                }

            })
            response.push(responseItem);
            id = element.id;
        }
    });

    response.forEach((element) => {
        element.products = removeDuplicates(element.products);
    });

    return response;

}

function returnOrderElaborate(orderVec) {

    let response = [];

    let id = 0;

    orderVec.forEach((element) => {

        if (element.id !== id) {

            let responseItem = new ReturnOrder(element.restockOrderId, element.id, element.returnDate,[]);
            orderVec.forEach((inner) => {

                let innerItem = {

                    SKUid : inner.SkuId,
                    description : inner.description,
                    itemId : inner.itemId,
                    price : inner.price,
                    RFID : inner.rfid
                    
                }
                
                if (element.id === inner.id) {
                    responseItem.products = responseItem.products.concat(innerItem);
                }
            })
            response.push(responseItem);
            id = element.id;
        }
    });


    return response;

}


module.exports = {restockOrderElaborate,
    removeDuplicatesSKU,
    internalOrderElaborate, 
    returnOrderElaborate}