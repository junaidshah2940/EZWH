
'use strict'

function TestDescriptor (id, name, procedureDescription,SKUid){

    this.id = id;
    this.name = name;
    this.procedureDescription = procedureDescription;
    this.idSKU = SKUid;

    //getters

    this.getid = () => {
        return this.id;
    }

    this.getName = () => {
        return this.name;
    }
    this.getProcedureDescription = () => {
        return this.procedureDescription;
    }
    this.getSKUId = () =>{
        return this.idSKU;
    }

    //setters

    this.setiD = (newid) =>{
        this.id = newid;
    }

    this.setName = (newName) => {
        this.name = newName;
    }
    this.setProcedureDescription = (newProcedureDescription) => {
        this.procedureDescription = newProcedureDescription;
    }
    this.setSKUId = (newSKUId) => {
        this.idSKU = newSKUId;
    }

}

module.exports = {TestDescriptor};
