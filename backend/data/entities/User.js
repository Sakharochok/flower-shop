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