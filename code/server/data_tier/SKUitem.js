'use strict'

function SKUitem(rfid, available, dateOfStock, SKUid, itemId ) {
    
    this.RFID = rfid;
    this.SKUId = SKUid;
    this.Available = available;
    this.DateOfStock = dateOfStock;
    this.itemId = itemId
  

    /* getters*/
    this.getRFID = () => {
        return this.RFID;
    }
    this.getAvailable = () => {
        return this.Available;
    }
    this.getDateOfStock = () => {
        return this.DateOfStock;
    }
    this.getSKUId = () => {
        return this.SKUId;
    }
    
    /*setters*/

    this.setRFID = (newRFID) => {
        this.RFID = newRFID;
    }
    this.setAvailable = (newAvailable) => {
        this.Available = newAvailable;

    }
    this.setDateOfStock = (newDateOfStock) => {
        this.DateOfStock = newDateOfStock; 
    }
    this.setSKUId = (newSKUId) => {
        this.SKUId = newSKUId;
    }
}

module.exports = {SKUitem}