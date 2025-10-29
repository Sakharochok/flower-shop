// frontend/js/main.js

// Imports the product array and the Flower class
// In this version, we still import directly from backend
import { products, Flower } from '../../backend/data/products/products.js';
import { updateCartCount, addToCart } from './cart.js';

const productListContainer = document.getElementById('product-list');

// Function to generate a single product card (Original Lab 2 version)
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card'; // Uses the original simpler class

    const isFlower = product instanceof Flower;

    // Original HTML structure for the card
    card.innerHTML = `
        <div class="product-link" data-id="${product.getId()}">
            <img src="${product.getImage()}" alt="${product.getName()}" class="product-image">
            <h3>${product.getName()}</h3>
            <p>${product.getDescription()}</p>
        </div>
        <p class="product-price">Ціна: ${product.getPrice()} грн</p>
        ${isFlower ? `<p style="font-size: 0.8em; color: gray;">Довжина стебла: ${product.isSuitableForTallVase() ? 'Довге' : 'Коротке'}</p>` : ''}
        <button class="add-to-cart-btn" data-id="${product.getId()}">Додати в кошик</button>
    `;

    // Click handler for the "Add to Cart" button
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop click from bubbling up to the card link
        addToCart(product);
    });

    // Click handler for the card link area
    const linkArea = card.querySelector('.product-link');
    linkArea.addEventListener('click', () => {
        // Redirect to details page
        window.location.href = `details.html?id=${product.getId()}`;
    });

    return card;
}

// Function to display all products (Original Lab 2 version)
function renderProductList() {
    if (!productListContainer) return;

    productListContainer.innerHTML = ''; // Clear container

    // Use the directly imported 'products' array
    products.forEach(product => {
        const cardElement = renderProductCard(product);
        productListContainer.appendChild(cardElement);
    });
}

// Launches product display after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderProductList(); // Render directly, no fetch needed in this version
});