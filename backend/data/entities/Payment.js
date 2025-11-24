// --- Class for representing a Payment ---
/**
 * Class for representing and processing a payment transaction.
 * @class
 * @name Payment
 */
export class Payment {
    #paymentId;
    #amount;
    #isPaid;
    #method;

    /**
     * Creates a Payment instance.
     * @constructor
     * @param {number} paymentId - Unique payment ID.
     * @param {number} amount - The amount to be paid.
     * @param {string} method - The payment method (e.g., 'card', 'cash').
     */
    constructor(paymentId, amount, method) {
        this.#paymentId = paymentId;
        this.#amount = amount;
        this.#method = method;
        this.#isPaid = false;
    }

    /**
     * Attempts to process the payment and updates the status.
     * @method
     * @returns {boolean} True if the payment was processed, False if it was already paid.
     */
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

    /**
     * Checks if the chosen method is card payment.
     * @returns {boolean} True if the method is 'card'.
     */
    // Non-trivial method
    isCardPayment() {
        return this.#method === 'card';
    }
}