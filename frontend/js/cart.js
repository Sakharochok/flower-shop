/**
 * Class managing the shopping cart state using Local Storage.
 * @class
 * @name Cart
 */
export class Cart {
    #items;
    constructor() {
        this.#items = JSON.parse(localStorage.getItem('cart')) || [];
    }
      
    /**
     * Adds an item to the cart or increments its quantity.
     * @method
     * @param {Object} product - The product object (must have getName, getId, getPrice, etc.).
     * @param {number} [quantityToAdd=1] - The number of units to add.
     */
    getItems() {
        return this.#items;
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.#items));
    }

    addItem(product, quantityToAdd = 1) {
        const existingItem = this.#items.find(item => item.id === product.getId());
        
        if (existingItem) {
            existingItem.quantity += quantityToAdd;
        } else {
            this.#items.push({ 
                id: product.getId(), 
                name: product.getName(), 
                price: product.getPrice(), 
                quantity: quantityToAdd,
                image: typeof product.getImage === 'function' ? product.getImage() : '/images/placeholder.jpg' 
            });
        }
        this.saveCart();
    }
    /**
     * Calculates the total count of all items in the cart.
     * @returns {number} The total quantity of items.
     */
    getTotalItemsCount() {
        return this.#items.reduce((sum, item) => sum + item.quantity, 0);
    }

    /**
     * Calculates the total price of all items in the cart.
     * @returns {number} The total price.
     */
    getTotalPrice() {
        return this.#items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    removeItem(productId) {
        this.#items = this.#items.filter(item => item.id != productId);
        this.saveCart();
    }
}

const cartInstance = new Cart();
const cartCountElement = document.getElementById('cart-count');

/**
 * Exports function to update the cart count displayed in the header UI.
 * @function
 */
export function updateCartCount() {
    if (cartCountElement) {
        cartCountElement.textContent = cartInstance.getTotalItemsCount();
    }
}
/**
 * Adds a product to the cart and notifies the user.
 * @function
 * @param {Object} product - The product object to add.
 * @param {number} [quantity=1] - Quantity to add.
 */
export function addToCart(product, quantity = 1) {
    cartInstance.addItem(product, quantity);
    updateCartCount();
    alert(`Item "${product.getName()}" (x${quantity}) added to cart!`);
}

export function renderCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const totalElement = document.getElementById('cart-total-price');
    const emptyMessage = document.getElementById('cart-empty-message');
    const buyButton = document.querySelector('.cart-header .buy-btn');

    if (!cartItemsList || !totalElement || !emptyMessage || !buyButton) {
        return;
    }

    cartItemsList.innerHTML = '';
    const items = cartInstance.getItems();

    if (items.length === 0) {
        emptyMessage.textContent = 'Your cart is empty.'; // (TRANSLATED)
        emptyMessage.style.display = 'block';
        buyButton.style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        buyButton.style.display = 'block';

        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item-card';
            
            const itemTotalPrice = item.price * item.quantity;

            itemElement.innerHTML = `
                <button class="remove-item-btn" data-id="${item.id}">
                    <img src="/images/close.svg" alt="Remove">
                </button>
                
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${item.quantity} PIECES - ${itemTotalPrice} UAH</p> </div>
            `;
            cartItemsList.appendChild(itemElement);
        });
    }

    totalElement.textContent = cartInstance.getTotalPrice();

    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonEl = e.currentTarget;
            const productId = buttonEl.dataset.id;
            cartInstance.removeItem(productId);
            renderCartItems();
            updateCartCount();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (document.getElementById('cart-items-list')) {
        renderCartItems();
    }
});