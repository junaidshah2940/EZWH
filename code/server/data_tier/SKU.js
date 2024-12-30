'use strict'

function SKU(id, description, weight, volume, notes, position, availableQuantity, price, testDescriptors) {
    this.id = id;
    this.description = description;
    this.weight = weight;
    this.volume = volume;
    this.notes = notes;
    this.position = position;
    this.availableQuantity = availableQuantity;
    this.price = price;
    this.testDescriptors = testDescriptors;

    /* getters*/
    this.getID = () => {
        return this.id;
    }
    this.getDescription = () => {
        return this.description;
    }
    this.getWeight = () => {
        return this.weight;
    }
    this.getVolume = () => {
        return this.volume;
    }
    this.getNotes = () => {
        return this.notes;
    }
    this.getPosition = () => {
        return this.position;
    }
    this.getAvailableQuantity= () => {
        return this.availableQuantity;
    }
    this.getPrice = () => {
        return this.price;
    }
    this.getTestDescriptors = () => {
        return this.testDescriptors;
    }
    
    /*setters*/

    this.setID = (newid) => {
        this.id = newid;
    }
    this.setDescription = (newdescription) => {
        this.description = newdescription;

    }
    this.setWeight = (newweight) => {
        this.weight = newweight;
      
    }
    this.setVolume = (newvolume) => {
        this.volume = newvolume;
    }
    this.setNotes = (newnotes) => {
        this.notes = newnotes;
    }
    this.setPosition = (newposition) => {
        this.position = newposition;
    }
    this.setAvailableQuantity= (newavailableQuantity) => {
        this.availableQuantity = newavailableQuantity;
    }
    this.setPrice = (newprice) => {
        this.price = newprice;
    }
    this.setTestDescriptors = (newtestDescriptors) => {
        this.testDescriptors = newtestDescriptors;
    }
}
module.exports = {SKU}