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