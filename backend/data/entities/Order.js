// backend/data/entities/Order.js

import { addDays, format } from 'date-fns'; // [NEW] External library for Lab 3

/**
 * Class representing a customer order.
 * @class
 * @name Order
 */
export class Order {
    #orderId;
    #customer;
    #items;
    #status;
    #creationDate; // [NEW] Stores when the order was created

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
        this.#creationDate = new Date(); 
    }

    getOrderId() { return this.#orderId; }
    getCustomer() { return this.#customer; }
    getItems() { return this.#items; }
    getStatus() { return this.#status; }

    /**
     * Calculates the estimated delivery date (Creation Date + 1 days).
     * This method uses the external 'date-fns' library.
     * @method
     * @returns {string} The estimated delivery date formatted as 'dd.MM.yyyy'.
     */
    getEstimatedDeliveryDate() {
        const deliveryDate = addDays(this.#creationDate, 1);
        return format(deliveryDate, 'dd.MM.yyyy');
    }

    /**
     * Adds an item to the order list.
     * @param {Object} item - The item to add (expected to have price and quantity properties).
     */
    addItem(item) {
        this.#items.push(item);
    }

    /**
     * Calculates the total cost of the order items.
     * @method
     * @returns {number} The sum of all items (price * quantity).
     */
    calculateTotal() {
        return this.#items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    /**
     * Updates the status of the order.
     * @method
     * @param {string} newStatus - The new status ('pending', 'shipped', or 'delivered').
     * @returns {boolean} True if the status was updated successfully.
     */
    updateStatus(newStatus) {
        const validStatus = ['pending', 'shipped', 'delivered'];
        if (validStatus.includes(newStatus)) {
            this.#status = newStatus;
            return true;
        }
        return false;
    }
}