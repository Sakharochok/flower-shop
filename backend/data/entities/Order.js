import { addDays, format } from 'date-fns';

/**
 * Class representing a customer order.
 * Implements the **Strategy Pattern** for shipping cost calculation.
 * @class
 * @name Order
 */
export class Order {
    #orderId;
    #customer;
    #items;
    #status;
    #creationDate; 

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

    /**
     * Sets the shipping strategy dynamically.
     * @param {Object} strategy - A concrete implementation of the ShippingStrategy interface.
     * @example
     * order.setShippingStrategy(new NovaPoshtaStrategy());
     */
    setShippingStrategy(strategy) {
        this.shippingStrategy = strategy;
    }

    getShippingCost() {
    if (!this.shippingStrategy) return 0;
        return this.shippingStrategy.calculate(this.customer.getShippingAddress());
    }

    /**
     * Calculates the total cost including shipping.
     * Uses the currently selected shipping strategy.
     * @returns {number} The final total price.
     */
    calculateTotalWithShipping() {
        return this.calculateTotal() + this.getShippingCost();
    }
}