// backend/data/Shipping.js

// --- Abstract base class for Shipping (Abstraction) ---
export class Shipping { // <-- Зверніть увагу, що тут теж потрібен export
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