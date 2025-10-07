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