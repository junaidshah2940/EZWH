
function InternalOrder(state, orderId, products, date, from, customerId){
    
    this.state = state;
    this.id = orderId;
    this.products = products;
    this.date = date;
    this.from = from;
    this.customerId = customerId;

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

    this.getDate = () => {

        return this.date;

    }

    this.getFrom = () => {

        return this.from;

    }

    this.getCustomerId = () => {

        return this.customerId;

    }


    //setters


    this.setOrderId = (newOrderId) => {

        this.prototype.getOrderId(newOrderId);

    }

    this.setProducts = (newProducts) => {

        this.prototype.getProducts(newProducts);

    }

    this.setSupplierId = (newSupplierId) => {

        this.prototype.setSupplierId(newSupplierId);

    }

    this.setDate = (newDate) => {

        this.date = newDate;

    }

    this.setFrom = (newFrom) => {

        this.from = newFrom;

    }

    this.setCustomerId = (newCustomerId) => {

        this.customerId = newCustomerId;

    }
}

module.exports = {InternalOrder}