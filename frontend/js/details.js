/**
 * Module handling the display and interaction logic for a single product details page.
 * @module details
 */
// Import cart functions
import { updateCartCount, addToCart } from './cart.js';

/**
 * Main function to fetch product data from the API based on URL ID and render the details.
 * @async
 * @function
 * @throws {Error} If Product ID is missing in the URL or the product is not found.
 */
async function renderProductDetails() {
    
    updateCartCount();

    const container = document.getElementById('product-detail-container');
    if (!container) {
        console.error('Product detail container not found.');
        return;
    }

    // This variable will hold the current quantity
    let currentQuantity = 1;
    // This variable will hold the full product data
    let currentProduct = null;

    try {
        // 1. Get the ID from the URL
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        if (!productId) {
            throw new Error('Product ID not found in URL.');
        }

        // 2. Make an API request for the single product
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Product not found (status: ${response.status})`);
        }
        
        // 3. Get the product data
        const product = await response.json();
        currentProduct = product; // Save product for later

        // 4. (NEW) Populate the HTML with the new Figma structure
        container.innerHTML = `
            <div class="details-layout">
                <div class="details-image-column">
                    <img src="${product.image}" alt="${product.name}" class="product-image-large">
                </div>

                <div class="details-info-column">
                    <h1>${product.name}</h1>
                    
                    <p class="detail-label">COLOR</p>
                    <p class="detail-value">${product.mainColor || 'N/A'}</p>
                    
                    <p class="detail-label">SEASON</p>
                    <p class="detail-value">${product.season || 'N/A'}</p>

                    <p class="detail-label">DESCRIPTION</p>
                    <p class="detail-value">${product.description}</p>
                    
                    <p class="product-price">${product.price} грн</p>

                    <div class="quantity-selector">
    <button class="quantity-btn" id="decrease-qty">
        <img src="/images/left.svg" alt="Decrease">
    </button>
    <span id="quantity-display">${currentQuantity}</span>
    <button class="quantity-btn" id="increase-qty">
        <img src="/images/right.svg" alt="Increase">
    </button>
</div>

                    <button class="add-to-cart-btn" id="add-to-cart-detail-btn">ADD TO CART</button>
                </div>
            </div>
        `;

        // 5. (NEW) Add handlers for quantity buttons
        const increaseBtn = document.getElementById('increase-qty');
        const decreaseBtn = document.getElementById('decrease-qty');
        const quantityDisplay = document.getElementById('quantity-display');

        increaseBtn.addEventListener('click', () => {
            currentQuantity++;
            quantityDisplay.textContent = currentQuantity;
        });

        decreaseBtn.addEventListener('click', () => {
            if (currentQuantity > 1) { // Don't go below 1
                currentQuantity--;
                quantityDisplay.textContent = currentQuantity;
            }
        });

        // 6. (UPDATED) Add handler for the "Add to Cart" button
        const detailButton = document.getElementById('add-to-cart-detail-btn');
        if (detailButton) {
            detailButton.addEventListener('click', () => {
              const cartProduct = {
                    getId: () => currentProduct.id,
                    getName: () => currentProduct.name,
                    getPrice: () => currentProduct.price,
                    // (NEW) Ми додаємо метод getImage
                    getImage: () => currentProduct.image, 
                    quantity: currentQuantity
                };
                
                // Call the modified addToCart function
                addToCart(cartProduct, currentQuantity); 
            });
        }

    } catch (error) {
        console.error('Failed to render product details:', error);
        container.innerHTML = '<h1>Товар не знайдено</h1><p>Помилка завантаження. Будь ласка, поверніться до магазину.</p>';
    }
}

// Run the function after the page loads
document.addEventListener('DOMContentLoaded', renderProductDetails);