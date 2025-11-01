import { updateCartCount } from './cart.js';

// DOM Elements
const productListContainer = document.getElementById('product-list');
const seasonalBtn = document.getElementById('seasonal-filter-btn');
const searchInput = document.getElementById('search-input');
// (NEW) Get the filter toggle button and advanced panel
const filterToggleBtn = document.getElementById('other-filter-btn'); 
const advancedFilterPanel = document.getElementById('advanced-filters');
// (NEW) Get the price inputs
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');


// --- Global State Variables ---
let allBouquets = []; // Stores all fetched bouquets

// Stores the current state of all filters
let currentFilters = {
    color: 'All',
    season: 'All-Year', // 'All-Year' means "no season filter"
    search: '',
    minPrice: 0,     // (NEW)
    maxPrice: 9999   // (NEW)
};


/**
 * (CORE LOGIC) Applies all current filters to the full bouquet list and re-renders.
 */
function applyFilters() {
    let filteredBouquets = allBouquets;
    
    // 1. Filter by Color
    if (currentFilters.color !== 'All') {
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.mainColor === currentFilters.color
        );
    }
    
    // 2. Filter by Season
    if (currentFilters.season !== 'All-Year') {
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.season !== 'All-Year' 
        );
    }
    
    // 3. Filter by Search Query
    if (currentFilters.search) {
        const lowerCaseSearch = currentFilters.search.toLowerCase();
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.name.toLowerCase().includes(lowerCaseSearch) 
        );
    }

    // 4. (NEW) Filter by Price
    filteredBouquets = filteredBouquets.filter(bouquet => {
        const price = bouquet.price;
        // Check if price is greater than min AND less than max
        return price >= currentFilters.minPrice && price <= currentFilters.maxPrice;
    });

    // Render the final filtered list
    renderProductList(filteredBouquets);
}


/**
 * Renders the list of bouquets into the container.
 * @param {Array<object>} bouquetsToRender - Array of bouquets to display.
 */
function renderProductList(bouquetsToRender) {
    if (!productListContainer) return;
    productListContainer.innerHTML = ''; 
    if (bouquetsToRender.length === 0) {
        productListContainer.innerHTML = '<p>No bouquets found matching the current filters.</p>';
        return;
    }
    bouquetsToRender.forEach(product => {
        const cardElement = renderProductCard(product);
        productListContainer.appendChild(cardElement);
    });
}

/**
 * Creates the HTML for a single product card.
 */
function renderProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card-simple'; 
    card.innerHTML = `
        <a href="details.html?id=${product.id}" class="product-link-simple">
            <img src="${product.image}" alt="${product.name}" class="product-image-simple">
            <h3>${product.name}</h3>
        </a>
    `;
    return card;
}


/**
 * Fetches products from the API, initializes `allBouquets`, and applies initial filters.
 */
async function fetchAndInitialize() {
    if (!productListContainer) return;
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const products = await response.json();
        allBouquets = products.filter(p => p.type === 'Bouquet');
        applyFilters(); // Apply initial filters (which includes default price)
    } catch (error) {
        console.error('Failed to fetch products:', error);
        productListContainer.innerHTML = '<p>Error loading products.</p>';
    }
}


/**
 * Sets up event listeners for the color filter dots (with toggle logic).
 */
function setupColorFilterListeners() {
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const clickedColor = dot.dataset.color;
            if (currentFilters.color === clickedColor) {
                currentFilters.color = 'All';
                dot.style.border = 'none';
            } else {
                currentFilters.color = clickedColor;
                colorDots.forEach(d => d.style.border = 'none');
                dot.style.border = '2px solid #D87093'; 
            }
            applyFilters();
        });
    });
}

/**
 * Sets up event listener for the seasonal button (toggle).
 */
function setupSeasonalFilterListener() {
    if (!seasonalBtn) return; 
    seasonalBtn.addEventListener('click', () => {
        if (currentFilters.season === 'All-Year') {
            currentFilters.season = 'Seasonal';
            seasonalBtn.style.backgroundColor = '#D87093'; 
            seasonalBtn.style.color = 'white';
        } else {
            currentFilters.season = 'All-Year';
            seasonalBtn.style.backgroundColor = '#FFB6C1'; 
            seasonalBtn.style.color = 'white';
        }
        applyFilters();
    });
}

/**
 * Sets up event listener for the search input.
 */
function setupSearchFilterListener() {
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        currentFilters.search = searchInput.value;
        applyFilters();
    });
}

/**
 * (NEW) Sets up listeners for the advanced filter panel (price).
 */
function setupAdvancedFilterListener() {
    // 1. Toggle the panel visibility
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', () => {
            const isHidden = advancedFilterPanel.style.display === 'none';
            advancedFilterPanel.style.display = isHidden ? 'flex' : 'none';
        });
    }

    // 2. Listen for changes in Min Price
    if (minPriceInput) {
        minPriceInput.addEventListener('input', () => {
            // Use parseFloat for numbers, default to 0 if empty
            currentFilters.minPrice = parseFloat(minPriceInput.value) || 0;
            applyFilters();
        });
    }

    // 3. Listen for changes in Max Price
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', () => {
            // Default to a very high number if empty
            currentFilters.maxPrice = parseFloat(maxPriceInput.value) || 9999;
            applyFilters();
        });
    }
}


// --- Main Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchAndInitialize(); 
    
    // Set up all FOUR filter event listener groups
    setupColorFilterListeners();
    setupSeasonalFilterListener();
    setupSearchFilterListener();
    setupAdvancedFilterListener(); // (NEW)
});