
function ReturnOrder(restockOrderId, returnOrderId, returnDate, itemList){
    
    this.restockOrderId = restockOrderId;
    this.returnDate = returnDate;
    this.id = returnOrderId;
    this.products = itemList;

    // getters


    this.getRestockOrder = () => {

        return this.restockOrder;

    }

    this.getReturnDate = () => {
        
        return this.returnDate;

    }

    this.getReturnOrderId = () => {

        return this.returnOrderId;

    }

 
    //setters

    this.setRestockOrder = (newRestockOrder) => {

        this.restockOrder = newRestockOrder;

    }

    this.setReturnDate = (newReturnDate) => {

        this.returnDate = newReturnDate;

    }

    this.setReturnOrderId = (newReturnOrderId) => {

        this.returnOrderId = newReturnOrderId

    }
}

module.exports = {ReturnOrder};