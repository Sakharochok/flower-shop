/**
 * Class representing a customer order.
 * @class
 * @name Order
 */
// --- Class for representing an Order ---
export class Order {
    #orderId;
    #customer;
    #items;
    #status;
    /**
     * Creates an Order instance.
     * @constructor
     * @param {number} orderId - The unique order ID.
     * @param {User} customer - The User object who placed the order.
     */
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
    /**
     * Adds an item to the order list.
     * @param {Object} item - The item to add (expected to have price and quantity properties).
     */
    // Non-trivial method
    addItem(item) {
        this.#items.push(item);
    }
    /**
     * Calculates the total cost of the order items.
     * @method
     * @returns {number} The sum of all items (price * quantity).
     */
    // Non-trivial method
    calculateTotal() {
        return this.#items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    /**
     * Updates the status of the order.
     * @method
     * @param {string} newStatus - The new status ('pending', 'shipped', or 'delivered').
     * @returns {boolean} True if the status was updated successfully.
     */
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