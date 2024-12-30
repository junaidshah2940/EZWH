
function RestockOrder(state, orderId, products, supplierId, issueDate, SKUItems, trasportNote = undefined) {
    
    this.state = state;
    this.id = orderId;
    this.products = products;
    this.supplierId = supplierId;
    this.SKUs = undefined;
    this.issueDate = issueDate;
    this.SKUItems = SKUItems;
    this.returnOrder = undefined;
    this.transportNote = trasportNote;

    // getters

    this.getState = () => {

        return this.prototype.getState();

    }

    this.getOrderId = () => {

        return this.prototype.getOrderId();

    }

    this.getProducts = () => {

        return this.prototype.getProducts();

    }

    this.getSupplierId = () => {

        return this.prototype.getSupplierId();

    }

    this.getIssueDate = () => {

        return this.issueDate;

    }

    this.getSKUItems = () => {
        
        return this.SKUItems;
    
    }

    this.getReturnOrder = () => {

        return this.returnOrder;

    }

    this.getTrasportNote = () => {
        return this.trasportNote;
    }

    //setters


    this.setOrderId = (newOrderId) => {

        this.prototype.setOrderId(newOrderId);

    }

    this.setProducts = (newProducts) => {

        this.prototype.setProducts(newProducts);

    }

    this.setSupplierId = (newSupplierId) => {

        this.prototype.setSupplierId(newSupplierId);

    }

    this.setIssueDate = (newIssueDate) => {

        this.issueDate = newIssueDate;

    }

    this.setSKUItems = (newSKUItems) => {

        this.SKUItems = newSKUItems;
    
    }

    this.setReturnOrder = (returnOrder) => {
        
        this.returnOrder = returnOrder;
    }
    
    this.setTrasportNote = (newTrasportNote) => {
        
        this.trasportNote = newTrasportNote;

    }
}

module.exports = {RestockOrder}