// frontend/js/main.js

// Imports the product array and the Flower class, as its logic is needed
import { products, Flower } from '../../backend/data/products/products.js';
import { updateCartCount, addToCart } from './cart.js';

const productListContainer = document.getElementById('product-list');

// Function to generate a single product card
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Checks if the item is a Flower to display additional information
    const isFlower = product instanceof Flower;
    
    // Card content (keeping UI elements in Ukrainian for user clarity)
    card.innerHTML = `
        <img src="${product.getImage()}" alt="${product.getName()}" class="product-image">
        <h3>${product.getName()}</h3>
        <p>${product.getDescription()}</p>
        <p>Ціна: ${product.getPrice()} грн</p>
        ${isFlower ? `<p style="font-size: 0.8em; color: gray;">Довжина стебла: ${product.isSuitableForTallVase() ? 'Довге' : 'Коротке'}</p>` : ''}
        <button class="add-to-cart-btn" data-id="${product.getId()}">Додати в кошик</button>
    `;

    // Click handler for the "Add to Cart" button
    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', () => {
        // Adds the product object to the cart
        addToCart(product);
    });

    return card;
}

// Function to display all products
function renderProductList() {
    if (!productListContainer) return;
    
    // Clears the container
    productListContainer.innerHTML = ''; 

    // Adds product cards
    products.forEach(product => {
        const cardElement = renderProductCard(product);
        productListContainer.appendChild(cardElement);
    });
}

// Launches product display after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Updates the cart counter on page load
    updateCartCount(); 
    // Displays the product list
    renderProductList();
});