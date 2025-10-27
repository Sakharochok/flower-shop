// frontend/js/builder.js

// Import ONLY cart functions
import { updateCartCount } from './cart.js';

// --- Global variables for the builder state ---
const availableItemsList = document.getElementById('available-items-list');
const bouquetItemsList = document.getElementById('bouquet-items-list');
const bouquetPlaceholder = document.getElementById('bouquet-placeholder');
const calculateBtn = document.getElementById('calculate-btn');
const resultDisplay = document.getElementById('result-display');

// This array will hold the SIMPLE JSON objects
let allComponents = []; 
// This array will hold just the *names*
let currentBouquetNames = []; 

/**
 * Fetches all products from the server
 */
async function fetchComponents() {
    if (!availableItemsList) return;

    try {
        const response = await fetch('http://localhost:3001/products');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Get the simple JSON data
        const serverProducts = await response.json();
        
        // Filter to get only buildable components
        allComponents = serverProducts.filter(p => {
            return (p.type === 'Flower') || (p.id === 200 || p.id === 202);
        });
        
        renderAvailableItems();
        
    } catch (error) {
        console.error('Failed to fetch components:', error);
        availableItemsList.innerHTML = '<p>Помилка завантаження компонентів.</p>';
    }
}

/**
 * Renders all available components in the left column
 */
function renderAvailableItems() {
    availableItemsList.innerHTML = ''; // Clear "Loading..."
    
    allComponents.forEach(item => {
        const itemElement = createItemElement(item);
        
        itemElement.addEventListener('click', () => {
            if (!currentBouquetNames.includes(item.name)) {
                addItemToBouquet(item);
            }
        });
        
        availableItemsList.appendChild(itemElement);
    });
}

/**
 * Adds a clicked item to the right column ("Your Bouquet")
 * @param {object} item - The simple JSON product to add
 */
function addItemToBouquet(item) {
    if (bouquetPlaceholder) {
        bouquetPlaceholder.style.display = 'none';
    }

    currentBouquetNames.push(item.name);

    const bouquetItemElement = createItemElement(item);
    bouquetItemElement.style.cursor = 'not-allowed';
    bouquetItemElement.style.backgroundColor = '#e9f5ff';
    
    bouquetItemsList.appendChild(bouquetItemElement);

    if (currentBouquetNames.length >= 2) {
        calculateBtn.disabled = false;
    }
    
    resultDisplay.innerHTML = '';
}

/**
 * Helper function to create a single item's HTML element
 * @param {object} item - The simple JSON product
 * @returns {HTMLElement} The new <div> element
 */
function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'builder-item';
    itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.price} грн</p>
        </div>
    `;
    return itemElement;
}

/**
 * Handles the click event for the "Calculate" button
 */
async function handleCalculateClick() {
    if (currentBouquetNames.length < 2) return;

    calculateBtn.disabled = true;
    calculateBtn.textContent = 'Розрахунок...';
    resultDisplay.innerHTML = '';

    try {
        // Send the array of names to our server endpoint
        const response = await fetch('http://localhost:3001/build-bouquet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ componentNames: currentBouquetNames }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Unknown server error');
        }

        // --- Success ---
        resultDisplay.style.color = '#0d47a1';
        resultDisplay.innerHTML = `
            Оптимальна вартість збірки: <b>${result.assemblyCost}</b>
            <br>
            (на основі ${result.connections} з'єднань)
        `;

    } catch (error) {
        console.error('Calculation failed:', error.message);
        resultDisplay.style.color = 'red';
        resultDisplay.textContent = `Помилка: ${error.message}`;
    }

    calculateBtn.disabled = false;
    calculateBtn.textContent = 'Розрахувати Вартість Збірки';
}

// --- Main Entry Point ---
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchComponents();
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculateClick);
    }
});