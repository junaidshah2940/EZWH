function Order (state, orderId, products, supplierId) {

    
    this.state = state;
    this.orderId = orderId;
    this.products = products;
    this.supplierId = supplierId;
    this.SKUs = undefined; //filled after the conversion between the item id stored in products and the SKUId

    // getters

    this.getState = () => {
        return this.state;
    }

    this.getOrderId = () => {
        return this.orderId;
    }

    this.getProducts = () => {
        return this.products;
    }

    this.getSupplierId = () => {
        return this.supplierId;
    }

    this.getSKUs = () => {
        return this.SKUs;
    }

    //setters

    this.setState = (newState) =>{
        this.state = newState;
    }

    this.setOrderId = (newOrderId) => {
        this.orderId = newOrderId;
    }

    this.setProducts = (newProducts) => {
        this.products = newProducts;
    }

    this.supplierId = (newSupplierId) => {
        this.supplierId = newSupplierId;
    }

    this.setSKUs = (SKUs) => {
        this.SKUs = SKUs;
    }

}


module.exports = {Order}