import { updateCartCount } from './cart.js';

// DOM Elements
const productListContainer = document.getElementById('product-list');
const emptyMessage = document.getElementById('products-empty-message');
const categoryHeading = document.getElementById('category-heading');
const seasonalBtn = document.getElementById('seasonal-filter-btn');
const searchInput = document.getElementById('search-input');
const filterToggleBtn = document.getElementById('other-filter-btn'); 
const advancedFilterPanel = document.getElementById('advanced-filters');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');

// --- Global State Variables ---
let allBouquetsInCategory = [];
let currentCategory = 'All';

let currentFilters = {
    color: 'All',
    season: 'All-Year',
    search: '',
    minPrice: 0,
    maxPrice: 9999
};

function applyFilters() {
    let filteredBouquets = allBouquetsInCategory;
    
    // ... (Filter logic remains the same) ...
    if (currentFilters.color !== 'All') {
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.mainColor === currentFilters.color
        );
    }
    if (currentFilters.season !== 'All-Year') {
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.season !== 'All-Year' 
        );
    }
    if (currentFilters.search) {
        const lowerCaseSearch = currentFilters.search.toLowerCase();
        filteredBouquets = filteredBouquets.filter(bouquet => 
            bouquet.name.toLowerCase().includes(lowerCaseSearch) 
        );
    }
    filteredBouquets = filteredBouquets.filter(bouquet => {
        const price = bouquet.price;
        return price >= currentFilters.minPrice && price <= currentFilters.maxPrice;
    });

    renderProductList(filteredBouquets);
}

function renderProductList(bouquetsToRender) {
    if (!productListContainer || !emptyMessage) return;
    
    productListContainer.innerHTML = ''; 

    if (bouquetsToRender.length === 0) {
        emptyMessage.textContent = 'No products found for this filter.'; // (TRANSLATED)
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        bouquetsToRender.forEach(product => {
            const cardElement = renderProductCard(product);
            productListContainer.appendChild(cardElement);
        });
    }
}

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

async function fetchAndInitialize() {
    if (!productListContainer) return;

    try {
        const params = new URLSearchParams(window.location.search);
        currentCategory = params.get('category');
        
        if (!currentCategory) {
            throw new Error('Category not specified in URL.'); // (TRANSLATED)
        }

        if (categoryHeading) categoryHeading.textContent = currentCategory;

        const singularLookup = {
            'Roses': 'Rose',
            'Lilies': 'Lily',
            'Peonies': 'Peony'
        };
        const singularCategory = singularLookup[currentCategory] || currentCategory;

        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allProducts = await response.json();
        
        allBouquetsInCategory = allProducts.filter(p => {
            if (p.type !== 'Bouquet') return false;
            const nameLower = p.name.toLowerCase();
            if (p.season === currentCategory) return true;
            if (nameLower.includes(currentCategory.toLowerCase())) return true;
            if (nameLower.includes(singularCategory.toLowerCase())) return true;
            return false;
        });
        
        applyFilters();

    } catch (error) {
        console.error('Failed to fetch products:', error);
        productListContainer.innerHTML = '';
        emptyMessage.textContent = `Error loading products: ${error.message}`; // (TRANSLATED)
        emptyMessage.style.display = 'block';
        if (categoryHeading) categoryHeading.textContent = 'Error'; // (TRANSLATED)
    }
}

// ... (All setup...Listener functions remain unchanged) ...
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
                dot.style.border = '2px solid #EFC1CF';
            }
            applyFilters();
        });
    });
}
function setupSeasonalFilterListener() {
    if (!seasonalBtn) return; 
    seasonalBtn.addEventListener('click', () => {
        if (currentFilters.season === 'All-Year') {
            currentFilters.season = 'Seasonal';
            seasonalBtn.style.backgroundColor = '#DBB0C0';
            seasonalBtn.style.color = 'white';
        } else {
            currentFilters.season = 'All-Year';
            seasonalBtn.style.backgroundColor = '#EFC1CF';
            seasonalBtn.style.color = 'white';
        }
        applyFilters();
    });
}
function setupSearchFilterListener() {
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        currentFilters.search = searchInput.value;
        applyFilters();
    });
}
function setupAdvancedFilterListener() {
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', () => {
            const isHidden = advancedFilterPanel.style.display === 'none';
            advancedFilterPanel.style.display = isHidden ? 'flex' : 'none';
        });
    }
    if (minPriceInput) {
        minPriceInput.addEventListener('input', () => {
            currentFilters.minPrice = parseFloat(minPriceInput.value) || 0;
            applyFilters();
        });
    }
    if (maxPriceInput) {
        maxPriceInput.addEventListener('input', () => {
            currentFilters.maxPrice = parseFloat(maxPriceInput.value) || 9999;
            applyFilters();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchAndInitialize();
    setupColorFilterListeners();
    setupSeasonalFilterListener();
    setupSearchFilterListener();
    setupAdvancedFilterListener();
});