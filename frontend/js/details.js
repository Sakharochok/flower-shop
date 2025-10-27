// frontend/js/details.js

// Import dependencies: product list and cart functions
import { products } from '../../backend/data/products/products.js';
import { updateCartCount, addToCart } from './cart.js';

/**
 * Main function responsible for rendering the product details page.
 * Executes after the DOM is fully loaded.
 */
function renderProductDetails() {
    
    // Update the cart counter in the header on page load
    updateCartCount();

    const container = document.getElementById('product-detail-container');
    if (!container) {
        console.error('Product detail container not found.');
        return;
    }

    // 1. Get the product ID from the URL parameters
    // (e.g., ?id=1)
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    // Handle cases where ID is missing or invalid
    if (!productId) {
        container.innerHTML = '<h1>Product not found</h1><p>Please return to the shop and try again.</p>';
        return;
    }

    // 2. Find the product object in the global list
    const product = products.find(p => p.getId() === productId);

    // Handle cases where no product matches the ID
    if (!product) {
        container.innerHTML = '<h1>Product not found</h1><p>Could not find a product with this ID.</p>';
        return;
    }

    // 3. Populate the HTML container with the product's data
    container.innerHTML = `
        <img src="${product.getImage()}" alt="${product.getName()}" class="product-image-large">
        <h1>${product.getName()}</h1>
        <p>${product.getDescription()}</p>
        <p class="product-price">Ціна: ${product.getPrice()} грн</p>
        <button class="add-to-cart-btn" id="add-to-cart-detail-btn">Додати в кошик</button>
    `;

    // 4. Attach an event handler to the newly created "Add to Cart" button
    const detailButton = document.getElementById('add-to-cart-detail-btn');
    if (detailButton) {
        detailButton.addEventListener('click', () => {
            addToCart(product);
        });
    }
}

// Main entry point: run the render function after the page loads
document.addEventListener('DOMContentLoaded', renderProductDetails);