// backend/data/entities.js

// --- Class for representing a User ---
export class User {
    #id;
    #name;
    #email;
    #shippingAddress;
    constructor(id, name, email) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#shippingAddress = null;
    }
    getId() { return this.#id; }
    getName() { return this.#name; }
    getEmail() { return this.#email; }
    setShippingAddress(address) {
        if (typeof address === 'string' && address.length > 5) {
            this.#shippingAddress = address;
            return true;
        }
        return false;
    }
     getShippingAddress() { 
        return this.#shippingAddress; 
    }

    // Non-trivial method
    generateWelcomeMessage() {
        return `Welcome, ${this.getName()}!`;
    }
    // Duplicate function definition removed (keeping one)
}

// --- Class for representing an Order ---
export class Order {
    #orderId;
    #customer;
    #items;
    #status;
    constructor(orderId, customer) {
        this.#orderId = orderId;
        this.#customer = customer;
        this.#items = [];
        this.#status = 'pending';
    }
    getOrderId() { return this.#orderId; }
    getCustomer() { return this.#customer; }
    getItems() { return this.#items; }
    getStatus() { return this.#status; }

    // Non-trivial method
    addItem(item) {
        this.#items.push(item);
    }

    // Non-trivial method
    calculateTotal() {
        return this.#items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Non-trivial method
    updateStatus(newStatus) {
        const validStatus = ['pending', 'shipped', 'delivered'];
        if (validStatus.includes(newStatus)) {
            this.#status = newStatus;
            return true;
        }
        return false;
    }
}

// --- Class for representing a Payment ---
export class Payment {
    #paymentId;
    #amount;
    #isPaid;
    #method;
    constructor(paymentId, amount, method) {
        this.#paymentId = paymentId;
        this.#amount = amount;
        this.#method = method;
        this.#isPaid = false;
    }
    getPaymentId() { return this.#paymentId; }
    getAmount() { return this.#amount; }
    isPaid() { return this.#isPaid; }

    // Non-trivial method
    processPayment() {
        if (!this.#isPaid) {
            console.log(`Processing payment for the amount of ${this.#amount} UAH using the ${this.#method} method...`);
            this.#isPaid = true;
            return true;
        }
        return false;
    }

    // Non-trivial method
    isCardPayment() {
        return this.#method === 'card';
    }
}

// --- Abstract base class for Shipping (Abstraction) ---
class Shipping {
    #shippingId;
    #address;
    constructor(shippingId, address) {
        // Enforcing abstraction: cannot instantiate directly
        if (this.constructor === Shipping) {
            throw new Error("Abstract class Shipping cannot be instantiated directly.");
        }
        this.#shippingId = shippingId;
        this.#address = address;
    }
    getShippingId() { return this.#shippingId; }
    getAddress() { return this.#address; }

    // Polymorphic method: must be implemented by derived classes
    calculateCost() {
        throw new Error("Method calculateCost() must be implemented by derived classes.");
    }

    // Non-trivial method
    generateTrackingNumber() {
        return `TRACK-${Math.floor(Math.random() * 1000000)}`;
    }
}

// --- Class for Nova Poshta Shipping (Inheritance and Polymorphism) ---
export class NovaPoshtaShipping extends Shipping {
    #warehouseNumber;
    constructor(shippingId, address, warehouseNumber) {
        super(shippingId, address);
        this.#warehouseNumber = warehouseNumber;
    }
    
    // Polymorphic method implementation
    calculateCost() {
        return 80;
    }
}