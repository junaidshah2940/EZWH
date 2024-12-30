'use strict'

function Position(positionID, aisleID, row, col, maxVolume,  maxWeight, occupiedVolume, occupiedWeight) {
    this.positionID = positionID;
    this.aisleID = aisleID;
    this.maxWeight = maxWeight;
    this.maxVolume = maxVolume;
    this.row = row;
    this.col = col;
    this.occupiedWeight = occupiedWeight;
    this.occupiedVolume = occupiedVolume;
 
    /* getters*/
    this.getID = () => {
        return this.positionID;
    }
    this.getIsleID = () => {
        return this.isleID;
    }
    this.getWeight = () => {
        return this.maxWeight;
    }
    this.getVolume = () => {
        return this.maxVolume;
    }
    this.getRow = () => {
        return this.row;
    }
    this.getCol = () => {
        return this.col;
    }
    this.getOccupiedWeight= () => {
        return this.occupiedWeight;
    }
    this.getOccupiedVolume = () => {
        return this.occupiedVolume;
    }

    
    /*setters*/

    this.setID = (newid) => {
        this.positionID = newid;
    }
    this.setIsleID = (newisleID) => {
        this.isleID = newisleID;

    }
    this.setWeight = (newweight) => {
        this.maxWeight = newweight;
      
    }
    this.setVolume = (newvolume) => {
        this.maxVolume = newvolume;
    }
    this.setRow = (newrow) => {
        this.row = newrow;
    }
    this.setCol = (newcolumn) => {
        this.col = newcolumn;
    }
    this.setOccupiedWeight= (newoccupiedWeight) => {
        this.occupiedWeight = newoccupiedWeight;
    }
    this.setOccupiedVolume = (newoccupiedVolume) => {
        this.occupiedVolume = newoccupiedVolume;
    }
}

module.exports = {Position}