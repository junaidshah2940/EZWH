'use strict'

function Session(ID, type, active) {
    this.ID = ID;
    this.type = type;
    this.active = active;
  

    /* getters*/
    this.getID = () => {
        return this.ID;
    }
    this.getType = () => {
        return this.type;
    }
    this.getActive = () => {
        return this.active;
    }

    
    /*setters*/

    this.setID = (newID) => {
        this.ID = newID;
    }
    this.setType = (newtype) => {
        this.type = newtype;
    }
    this.setActive = (newactive) => {
        this.active = newactive; 
    }
}

export default Session;