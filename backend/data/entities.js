// backend/data/entities.js

// --- Клас для представлення користувача ---
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

    generateWelcomeMessage() { 
        return `Ласкаво просимо, ${this.getName()}!`; 
    }
    generateWelcomeMessage() {
        return `Ласкаво просимо, ${this.getName()}!`;
    }
}

// --- Клас для представлення замовлення ---
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
    addItem(item) {
        this.#items.push(item);
    }
    calculateTotal() {
        return this.#items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    updateStatus(newStatus) {
        const validStatus = ['pending', 'shipped', 'delivered'];
        if (validStatus.includes(newStatus)) {
            this.#status = newStatus;
            return true;
        }
        return false;
    }
}

// --- Клас для представлення оплати ---
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
    processPayment() {
        if (!this.#isPaid) {
            console.log(`Обробка платежу на суму ${this.#amount} грн методом ${this.#method}...`);
            this.#isPaid = true;
            return true;
        }
        return false;
    }
    isCardPayment() {
        return this.#method === 'card';
    }
}

// --- Абстрактний базовий клас для доставки ---
class Shipping {
    #shippingId;
    #address;
    constructor(shippingId, address) {
        if (this.constructor === Shipping) {
            throw new Error("Абстрактний клас Shipping не може бути інстанційований напряму.");
        }
        this.#shippingId = shippingId;
        this.#address = address;
    }
    getShippingId() { return this.#shippingId; }
    getAddress() { return this.#address; }
    calculateCost() {
        throw new Error("Метод calculateCost() має бути реалізований класами-нащадками.");
    }
    generateTrackingNumber() {
        return `TRACK-${Math.floor(Math.random() * 1000000)}`;
    }
}

// --- Клас для доставки Новою Поштою ---
export class NovaPoshtaShipping extends Shipping {
    #warehouseNumber;
    constructor(shippingId, address, warehouseNumber) {
        super(shippingId, address);
        this.#warehouseNumber = warehouseNumber;
    }
    calculateCost() {
        return 80;
    }
}