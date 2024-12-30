
'use strict'

function TestResult(id,idTestDescriptor,Date,Result,rfid){

    this.id = id;    
    this.idTestDescriptor = idTestDescriptor;
    this.Date = Date;
    this.Result = Result;
    this.rfid = rfid;
    


//getters

    this.getid = () =>{
        return this.id;
    }
    this.getidTestDescriptor = () => {
        return this.idTestDescriptor;
    }

    this.getDate = () => {
        return this.Date;
    }

    this.getResult = () =>{
        return this.Result;
    }
    this.getrfid = () =>{
        return this.rfid;
    }

 //setters

    this.setid = (newid) => {
        this.id = newid;
    }
    this.setidTestDescriptor = (newidTestDescriptor) =>{
        this.idTestDescriptor = newidTestDescriptor;
    }

    this.setDate = (newDate) => {
        this.Date = newDate;
    }

    this.setResult = (newResult) => {
        this.Result = newResult;
    }
    this.setrfid = (newrfid) => {
        this.rfid = newrfid;
    }


}

module.exports = {TestResult} ;
