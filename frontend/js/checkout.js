/**
 * Module handling the checkout process and integration with backend entities.
 * @module checkout
 */
import { Cart } from './cart.js';
import { updateCartCount } from './cart.js';
import { User, Order, Payment } from '/entities/entities.js';


const cart = new Cart();

/**
 * Main function to initialize the checkout page and handle form submission.
 * @function
 */
function initializeCheckout() {
    updateCartCount();
    const summaryTotalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const formMessageEl = document.getElementById('form-message');

    const total = cart.getTotalPrice();
    if (summaryTotalEl) {
        summaryTotalEl.textContent = `${total} UAH`; // (TRANSLATED)
    }

    if (!checkoutForm) {
        console.error("Checkout form element not found.");
        return;
    }

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        formMessageEl.textContent = '';
        formMessageEl.style.color = 'black';

        if (cart.getTotalItemsCount() === 0) {
            formMessageEl.textContent = 'Your cart is empty.'; // (TRANSLATED)
            formMessageEl.style.color = 'red';
            return;
        }

        try {
            const formData = new FormData(checkoutForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const address = formData.get('address');
            const paymentMethod = formData.get('payment-method');
            
            const user = new User(1, name, email);
            const addressSet = user.setShippingAddress(address);

            if (!addressSet) {
                 throw new Error('Address must be longer than 5 characters.'); // (TRANSLATED)
            }

            const order = new Order(101, user);
            cart.getItems().forEach(item => order.addItem(item));
            const orderTotal = order.calculateTotal();

            const payment = new Payment(201, orderTotal, paymentMethod);
            payment.processPayment();
            
            console.log('Order successfully processed:', {
                user: user.getName(),
                address: user.getShippingAddress(),
                total: orderTotal,
                isPaid: payment.isPaid()
            });

            formMessageEl.textContent = `Thank you, ${user.getName()}! Your order #${order.getOrderId()} for ${orderTotal} UAH has been processed.`;
            formMessageEl.style.color = 'green';
            
            checkoutForm.querySelector('button').disabled = true;
        } catch (error) {
            console.error('Checkout failed:', error.message);
            formMessageEl.textContent = `Error: ${error.message}`; 
            formMessageEl.style.color = 'red';
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeCheckout);