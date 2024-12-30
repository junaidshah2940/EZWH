'use strict'

function Item(id, description, SKUid, supplierID,  price, quantity ) {
    this.itemId = id;
    this.description = description;
    this.SKUId = SKUid;
    this.supplierId = supplierID;
    this.price = price;
    this.qty = quantity;

    /* getters*/
    this.getID = () => {
        return this.id;
    }
    this.getDescription = () => {
        return this.description;
    }
    this.getSKUid = () => {
        return this.SKUid;
    }
    this.getSupplierID = () => {
        return this.supplierID;
    }    
    this.getPrice = () => {
        return this.price;
    }

    
    /*setters*/

    this.setID = (newid) => {
        this.id = newid;
    }
    this.setDescription = (newdescription) => {
        this.description = newdescription;
    }
    this.setSKUid = (newSKUid) => {
        this.SKUid = newSKUid;      
    }
    this.setSupplierID = (newsupplierID) => {
        this.supplierID = newsupplierID;
    }
    this.setPrice = (newprice) => {
        this.price = newprice;
    }
}

module.exports = {Item};