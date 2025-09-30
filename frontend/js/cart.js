// Клас для представлення кошика
export class Cart {
    #items;
    constructor() {
        this.#items = JSON.parse(localStorage.getItem('cart')) || [];
    }
        getItems() {
        return this.#items;
    }

    // Нетривіальний метод
    // Зберігає вміст кошика в LocalStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.#items));
    }

    // Нетривіальний метод
    // Додає товар до кошика
    addItem(product) {
        const existingItem = this.#items.find(item => item.id === product.getId());
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.#items.push({ id: product.getId(), name: product.getName(), price: product.getPrice(), quantity: 1 });
        }
        this.saveCart();
    }

    // Нетривіальний метод
    // Розраховує загальну кількість товарів у кошику
    getTotalItemsCount() {
        return this.#items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Нетривіальний метод
    // Розраховує загальну суму кошика
    getTotalPrice() {
        return this.#items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
        // Нетривіальний метод
    // Видаляє товар повністю з кошика
    removeItem(productId) {
        this.#items = this.#items.filter(item => item.id !== productId);
        this.saveCart();
    }
}

// Створюємо єдиний екземпляр кошика
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
    alert(`Товар "${product.getName()}" додано до кошика!`);
}

export function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartItemsContainer || !cartTotalElement) return;

    cartItemsContainer.innerHTML = '';
    const items = cartInstance.getItems();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '<p>Кошик порожній.</p>';
    } else {
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${item.price * item.quantity} грн</span>
                <button class="remove-item-btn" data-id="${item.id}">Видалити</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Додаємо обробники подій для кнопок "Видалити"
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.dataset.id);
                // Викликаємо новий метод класу Cart
                cartInstance.removeItem(productId);
                // Оновлюємо відображення
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