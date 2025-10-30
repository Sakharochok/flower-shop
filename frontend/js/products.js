// Import the factory
import { createProductInstance } from './productFactory.js';
// Import cart functions
import { updateCartCount, addToCart } from './cart.js';
// Import class definition for 'instanceof' check
import { Flower } from '../../backend/data/products/Flower.js';

const productListContainer = document.getElementById('product-list');
const categoryHeading = document.getElementById('category-heading');

/**
 * Fetches all products, then filters them based on the URL parameter
 */
async function fetchAndFilterProducts() {
    // 1. Read the category name from the URL (e.g., ?category=Roses)
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');

    if (!category) {
        if (categoryHeading) categoryHeading.textContent = 'Категорію не вибрано';
        if (productListContainer) productListContainer.innerHTML = '<p>Будь ласка, поверніться та виберіть категорію.</p>';
        return;
    }
    
    // Update the heading
    if (categoryHeading) categoryHeading.textContent = `Категорія: ${category}`;

    try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
        const rawProducts = await response.json();
        
        // Convert raw data into class instances
        const allClientSideProducts = rawProducts.map(createProductInstance).filter(p => p !== null);

        // --- 2. THIS IS THE NEW LOGIC: Filter the products ---
        const filteredProducts = allClientSideProducts.filter(product => {
            // Check if the product name includes the category string
            return product.getName().toLowerCase().includes(category.toLowerCase());
        });
        
        // --- 3. Render only the filtered list ---
        renderProductList(filteredProducts);

    } catch (error) {
        console.error('Failed to fetch or process products:', error);
        if (productListContainer) {
             productListContainer.innerHTML = '<p>Помилка завантаження товарів. Сервер запущено?</p>';
        }
    }
}

/**
 * Renders a list of product cards into the DOM
 * (This function is identical to the one in main.js)
 * @param {Array<ShopItem>} productsToRender - The array of products to display
 */
function renderProductList(productsToRender) {
    if (!productListContainer) return;
    productListContainer.innerHTML = ''; // Clear "Loading..."

    if (!productsToRender || productsToRender.length === 0) {
         productListContainer.innerHTML = '<p>Товарів цієї категорії не знайдено.</p>';
         return;
    }

    productsToRender.forEach(product => {
        if (!product) return;
        try {
            const cardElement = renderProductCard(product);
            productListContainer.appendChild(cardElement);
        } catch (error) {
            console.error("Error rendering product card for:", product?.getName ? product.getName() : product, error);
        }
    });
}

/**
 * Renders a single product card using a class instance
 * (This function is identical to the one in main.js)
 * @param {ShopItem} product - An instance of Flower, Bouquet, etc.
 */
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.getId();

    const isFlower = product.constructor.name === 'Flower';
    const premiumBadge = product.isPricy && product.isPricy() ? `<span class="badge-premium">Преміум</span>` : '';

    card.innerHTML = `
        ${premiumBadge}
        <a href="details.html?id=${product.getId()}" class="product-link">
            <img src="${product.getImage()}" alt="${product.getName()}" class="product-image">
            <div class="product-content">
                <h3>${product.getName()}</h3>
                <p>${product.getDescription ? product.getDescription() : 'No description available.'}</p>
                <p class="product-price">Ціна: ${product.getPrice()} грн</p>
                 ${isFlower && product.isSuitableForTallVase ? `<p style="font-size: 0.8em; color: gray;">Довжина стебла: ${product.isSuitableForTallVase() ? 'Довге' : 'Коротке'}</p>` : ''}
            </div>
        </a>
        <button class="add-to-cart-btn" data-id="${product.getId()}">Додати в кошик</button>
    `;

    const button = card.querySelector('.add-to-cart-btn');
    button.addEventListener('click', (e) => {
        addToCart(product);
    });

    return card;
}

// Main entry point
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchAndFilterProducts(); // Call the new filtering function
});