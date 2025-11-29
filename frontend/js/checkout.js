/**
 * Module handling the checkout process and integration with backend API.
 * @module checkout
 */
import { Cart } from './cart.js';
import { updateCartCount } from './cart.js';

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
        summaryTotalEl.textContent = `${total} UAH`;
    }

    if (!checkoutForm) {
        console.error("Checkout form element not found.");
        return;
    }

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        formMessageEl.textContent = '';
        formMessageEl.style.color = 'black';

        if (cart.getTotalItemsCount() === 0) {
            formMessageEl.textContent = 'Your cart is empty.';
            formMessageEl.style.color = 'red';
            return;
        }

        try {
            // Extract data from the form
            const formData = new FormData(checkoutForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const address = formData.get('address');
            const paymentMethod = formData.get('payment-method');

            // Send data to the backend API
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: { name, email, address },
                    items: cart.getItems(),
                    paymentMethod: paymentMethod
                })
            });

            const result = await response.json();

            if (!response.ok) {
                // Display error from server (e.g. validation error)
                throw new Error(result.error || 'Order failed');
            }
            
            console.log('Order successfully processed:', result);

            // [UPDATED] Show success message with Delivery Date from backend
            formMessageEl.innerHTML = `
                Thank you, ${result.customerName}!<br>
                Order #${result.orderId} confirmed.<br>
                Total: ${result.totalPaid} UAH.<br>
                <strong>Estimated Delivery: ${result.estimatedDelivery}</strong>
            `;
            formMessageEl.style.color = 'green';
            
            // Clear cart logic
            if (typeof cart.clearCart === 'function') {
                cart.clearCart();
            } else {
                // Fallback if clearCart method doesn't exist yet
                localStorage.removeItem('cart'); 
                // Reload page or force update UI might be needed here normally
            }
            updateCartCount();
            
            checkoutForm.querySelector('button').disabled = true;

        } catch (error) {
            console.error('Checkout failed:', error.message);
            formMessageEl.textContent = `Error: ${error.message}`; 
            formMessageEl.style.color = 'red';
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeCheckout);