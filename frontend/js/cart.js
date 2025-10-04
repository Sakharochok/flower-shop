// Class to represent the shopping cart
export class Cart {
    #items;
    constructor() {
        this.#items = JSON.parse(localStorage.getItem('cart')) || [];
    }
        getItems() {
        return this.#items;
    }

    // Non-trivial method
    // Saves the cart contents to LocalStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.#items));
    }

    // Non-trivial method
    // Adds a product to the cart
    addItem(product) {
        const existingItem = this.#items.find(item => item.id === product.getId());
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.#items.push({ id: product.getId(), name: product.getName(), price: product.getPrice(), quantity: 1 });
        }
        this.saveCart();
    }

    // Non-trivial method
    // Calculates the total number of items in the cart
    getTotalItemsCount() {
        return this.#items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Non-trivial method
    // Calculates the total price of the cart
    getTotalPrice() {
        return this.#items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
        // Non-trivial method
    // Removes an item completely from the cart
    removeItem(productId) {
        this.#items = this.#items.filter(item => item.id !== productId);
        this.saveCart();
    }
}

// Creates a single cart instance
const cartInstance = new Cart();
const cartCountElement = document.getElementById('cart-count');

export function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartInstance.getTotalItemsCount();
    }
}

export function addToCart(product) {
    cartInstance.addItem(product);
    updateCartCount();
    alert(`Item "${product.getName()}" added to cart!`);
}

export function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';
    const items = cartInstance.getItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p>The cart is empty.</p>';
    } else {
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            // Note: Keeping "грн" and "Видалити" in Ukrainian for UI consistency
            itemElement.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${item.price * item.quantity} грн</span>
                <button class="remove-item-btn" data-id="${item.id}">Видалити</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Adds event handlers for the "Remove" buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                // Calls the new Cart class method
                cartInstance.removeItem(productId);
                // Updates the display
                renderCartItems();
                updateCartCount();
            });
        });
    }

    cartTotalElement.textContent = cartInstance.getTotalPrice();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }
});