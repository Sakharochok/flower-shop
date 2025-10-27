// frontend/js/checkout.js

import { Cart } from './cart.js';
import { updateCartCount } from './cart.js';

const cart = new Cart();

/**
 * Handles the main logic for the checkout page
 */
function initializeCheckout() {
 
    updateCartCount();
    
    // Get all required DOM elements
    const summaryTotalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const formMessageEl = document.getElementById('form-message');

    // 1. Load Order Summary from localStorage
    const total = cart.getTotalPrice();
    if (summaryTotalEl) {
        // UI text remains in Ukrainian
        summaryTotalEl.textContent = `${total} грн`;
    }

    if (!checkoutForm) {
        console.error("Checkout form element not found.");
        return;
    }

    // 2. Add the submit event handler for the form
    checkoutForm.addEventListener('submit', async (e) => {
        // Prevent the form from actually submitting (reloading the page)
        e.preventDefault(); 
        
        formMessageEl.textContent = 'Обробка замовлення...';
        formMessageEl.style.color = 'blue';

        if (cart.getTotalItemsCount() === 0) {
            formMessageEl.textContent = 'Ваш кошик порожній.';
            formMessageEl.style.color = 'red';
            return;
        }

        // --- Client-Side Logic ---
        // 1. Collect all data into a simple JSON object
        // This file no longer knows *how* a User or Order works.
        const formData = new FormData(checkoutForm);
        const orderData = {
            user: {
                name: formData.get('name'),
                email: formData.get('email'),
                address: formData.get('address'),
            },
            paymentMethod: formData.get('payment-method'),
            items: cart.getItems(), // Send the cart items from localStorage
        };

        // 2. Send the data to the SERVER via fetch
        try {
            const response = await fetch('http://localhost:3001/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            // Get the JSON response from the server
            const result = await response.json();

            if (!response.ok) {
                // Handle server-side validation errors
                // (e.g., the address was too short)
                throw new Error(result.error || 'Невідома помилка сервера');
            }

            // --- Success ---
            // 3. Display the rich response from the server
            // We are now showing data we didn't have before
            // (shippingCost, trackingNumber)
            formMessageEl.innerHTML = `
                <p style="color: green; font-weight: bold;">Дякуємо, ${result.customerName}!</p>
                <p>Ваше замовлення #${result.orderId} успішно прийнято.</p>
                <p>Вартість доставки: ${result.shippingCost} грн</p>
                <p><b>Загальна сума: ${result.totalPaid} грн</b></p>
                <p>Номер відстеження: <b>${result.trackingNumber}</b></p>
            `;
            formMessageEl.style.color = 'green';
            
            // Disable the form to prevent double-submission
            checkoutForm.querySelector('button').disabled = true;

        } catch (error) {
            // Handle any errors (like validation or network failure)
            console.error('Checkout failed:', error.message);
            formMessageEl.textContent = `Помилка: ${error.message}`;
            formMessageEl.style.color = 'red';
        }
    });
}

// Main entry point: run after the page loads
document.addEventListener('DOMContentLoaded', initializeCheckout);