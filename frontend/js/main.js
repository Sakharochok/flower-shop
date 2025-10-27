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
    
    // Card content
    // I wrapped the image and title in a 'product-link' div for better click handling
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
        e.stopPropagation(); // Stop click from bubbling up to the card
        addToCart(product);
    });

    // NEW (Lab 2): Click handler for the entire card (via the new div)
    // This adds a new event handler
    const linkArea = card.querySelector('.product-link');
    linkArea.addEventListener('click', () => {
        // Redirect to details page, passing product ID in the URL
        window.location.href = `details.html?id=${product.getId()}`;
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
// This is our first event handler
document.addEventListener('DOMContentLoaded', () => {
    // Updates the cart counter on page load
    updateCartCount(); 
    // Displays the product list
    renderProductList();
});