/**
 * Class representing a user in the system.
 * @class
 * @name User
 */
export class User {
    #id;
    #name;
    #email;
    #shippingAddress;
    /**
     * Creates a new user instance.
     * @constructor
     * @param {number} id - The unique user ID.
     * @param {string} name - The user's name.
     * @param {string} email - The user's email address.
     */
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
    /**
     * Sets the shipping address with validation.
     * @method
     * @param {string} address - The delivery address (must be longer than 5 characters).
     * @returns {boolean} True if the address was set successfully, otherwise False.
     * @example
     * user.setShippingAddress("Kyiv, Khreshchatyk 1"); // returns true
     */
     getShippingAddress() { 
        return this.#shippingAddress; 
    }
/**
     * Generates a welcome message for the user.
     * @returns {string} The welcome message.
     */
    // Non-trivial method
    generateWelcomeMessage() {
        return `Welcome, ${this.getName()}!`;
    }
    // Duplicate function definition removed (keeping one)
}