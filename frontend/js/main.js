import products from '../../backend/data/products.js';
import { updateCartCount, addToCart } from './cart.js';

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.getImage()}" alt="${product.getName()}" class="product-image">
        <h3>${product.getName()}</h3>
        <p>${product.getPrice()} грн</p>
        <button class="add-to-cart-btn" data-id="${product.getId()}">Додати в кошик</button>
    `;
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', () => {
        addToCart(product);
    });
    return card;
}

function renderProducts() {
    const productList = document.getElementById('product-list');
    if (productList) {
        products.forEach(product => {
            productList.appendChild(createProductCard(product));
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});