// frontend/js/checkout.js

import { Cart } from './cart.js';
import { updateCartCount } from './cart.js';

const cart = new Cart();

function initializeCheckout() {
    updateCartCount();
    const summaryTotalEl = document.getElementById('summary-total');
    const checkoutForm = document.getElementById('checkout-form');
    const formMessageEl = document.getElementById('form-message');

    const total = cart.getTotalPrice();
    if (summaryTotalEl) {
        summaryTotalEl.textContent = `${total} грн`;
    }

    if (!checkoutForm) { console.error("Checkout form element not found."); return; }

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        formMessageEl.textContent = 'Обробка замовлення...';
        formMessageEl.style.color = 'blue';

        if (cart.getTotalItemsCount() === 0) {
            formMessageEl.textContent = 'Ваш кошик порожній.';
            formMessageEl.style.color = 'red';
            return;
        }

        const formData = new FormData(checkoutForm);
        const orderData = {
            user: {
                name: formData.get('name'),
                email: formData.get('email'),
                address: formData.get('address'),
            },
            paymentMethod: formData.get('payment-method'),
            items: cart.getItems(),
        };

        try {
            // Send data to the SERVER
            const response = await fetch('http://localhost:3001/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.error || 'Невідома помилка сервера'); }

            // --- UPDATED: Use the welcome message from the server ---
            formMessageEl.innerHTML = `
                <p style="color: green; font-weight: bold;">${result.welcomeMessage}</p> <p>Ваше замовлення #${result.orderId} успішно прийнято.</p>
                <p>Вартість доставки: ${result.shippingCost} грн</p>
                <p><b>Загальна сума: ${result.totalPaid} грн</b></p>
                <p>Номер відстеження: <b>${result.trackingNumber}</b></p>`;
            formMessageEl.style.color = 'green';
            checkoutForm.querySelector('button').disabled = true;
        } catch (error) {
            console.error('Checkout failed:', error.message);
            formMessageEl.textContent = `Помилка: ${error.message}`;
            formMessageEl.style.color = 'red';
        }
    });
}

document.addEventListener('DOMContentLoaded', initializeCheckout);