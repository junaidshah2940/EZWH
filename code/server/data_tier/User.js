'use strict'

function User(ID, email, password, name, surname, type) {
    this.id = ID;
    this.email = email;
    this.password = password;
    this.name= name;
    this.surname=surname;
    this.type=type;
  

    /* getters*/
    this.getID = () => {
        return this.id;
    }
    this.getEmail = () => {
        return this.email;
    }
    this.getPassword = () => {
        return this.password;
    }
    this.getName = () => {
        return this.name;
    }
    this.getSurname = () => {
        return this.surname;
    }
    this.getType = () => {
        return this.type;
    }
    
    /*setters*/

    this.setID = (newID) => {
        this.id = newID;
    }
    this.setEmail = (newemail) => {
        this.email = newemail;
    }
    this.setPassword = (newpassword) => {
        this.password = newpassword;  
    }
    this.setName = (newname) => {
        this.name = newname;
    }    
    this.setSurname = (newsurname) => {
        this.surname = newsurname;
    }
    this.setType = (newtype) => {
        this.type = newtype;
    }
}

module.exports = {User};