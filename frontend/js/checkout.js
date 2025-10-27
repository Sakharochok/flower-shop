// Import the Cart class (to get items) and the backend entity classes
import { Cart } from './cart.js';
import { User } from '../../backend/data/entities/User.js';
import { Order } from '../../backend/data/entities/Order.js';
import { Payment } from '../../backend/data/entities/Payment.js';
import { updateCartCount } from './cart.js';

// Initialize a new cart instance just for this page's logic
const cart = new Cart();

/**
 * Handles the main logic for the checkout page
 */
function initializeCheckout() {
    // Update the header cart count
    updateCartCount();
    
    // Get all required DOM elements
    const summaryTotalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const formMessageEl = document.getElementById('form-message');

    // 1. Load Order Summary
    // This is triggered by the DOMContentLoaded event handler below
    const total = cart.getTotalPrice();
    if (summaryTotalEl) {
        // UI text remains in Ukrainian
        summaryTotalEl.textContent = `${total} грн`;
    }

    // Stop if the form doesn't exist
    if (!checkoutForm) {
        console.error("Checkout form element not found.");
        return;
    }

    // 2. Add the submit event handler for the form
    checkoutForm.addEventListener('submit', (e) => {
        // Prevent the form from actually submitting (reloading the page)
        e.preventDefault(); 
        
        // Clear previous messages
        formMessageEl.textContent = '';
        formMessageEl.style.color = 'black';

        // Check if cart is empty
        if (cart.getTotalItemsCount() === 0) {
            // UI text remains in Ukrainian
            formMessageEl.textContent = 'Ваш кошик порожній. Неможливо оформити замовлення.';
            formMessageEl.style.color = 'red';
            return;
        }

        // --- SEPARATION OF CONCERNS ---
        // Here, the GUI (checkout.js) collects data...
        // ...and passes it to the Business Logic Classes (User, Order, Payment)

        try {
            // Get data from the form controls
            const formData = new FormData(checkoutForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const address = formData.get('address');
            const paymentMethod = formData.get('payment-method');
            
            // --- 1. Use the User class ---
            const user = new User(1, name, email);
            // We use a non-trivial method with validation
            const addressSet = user.setShippingAddress(address);

            // Check if validation in the class failed
            if (!addressSet) {
                 // UI text remains in Ukrainian
                 throw new Error('Адреса має бути довшою за 5 символів.');
            }

            // --- 2. Use the Order class ---
            const order = new Order(101, user);
            // Add items from the cart to the order
            cart.getItems().forEach(item => order.addItem(item));

            // Use a non-trivial method to get the final total
            const orderTotal = order.calculateTotal();

            // --- 3. Use the Payment class ---
            const payment = new Payment(201, orderTotal, paymentMethod);
            // Use a non-trivial method to process
            payment.processPayment();
            
            // --- Success ---
            console.log('Order successfully processed:', {
                user: user.getName(),
                address: user.getShippingAddress(),
                total: orderTotal,
                isPaid: payment.isPaid()
            });

            // Show success message to the user (UI text in Ukrainian)
            formMessageEl.textContent = `Дякуємо, ${user.getName()}! Ваше замовлення #${order.getOrderId()} на суму ${orderTotal} грн прийнято.`;
            formMessageEl.style.color = 'green';
            
            // Disable the form
            checkoutForm.querySelector('button').disabled = true;

        } catch (error) {
            // Handle any errors (e.g., from validation)
            console.error('Checkout failed:', error.message);
            // UI text remains in Ukrainian
            formMessageEl.textContent = `Помилка: ${error.message}`;
            formMessageEl.style.color = 'red';
        }
    });
}

// Main entry point: run after the page loads
document.addEventListener('DOMContentLoaded', initializeCheckout);