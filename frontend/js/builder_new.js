import { updateCartCount, addToCart } from './cart.js';

let lastCalculatedBouquetPrice = 0;
let bouquetNameCounter = 1;

const availableItemsList = document.getElementById('available-items-list');
const dropZone = document.getElementById('drop-zone');
const bouquetPlaceholder = document.getElementById('bouquet-placeholder');
const calculateBtn = document.getElementById('calculate-btn');
const resultDisplay = document.getElementById('result-display');
const addBouquetToCartBtn = document.getElementById('add-bouquet-to-cart-btn');

let allComponents = []; 
let currentBouquetItems = []; 
let dropCounter = 0;

async function fetchComponents() {
    if (!availableItemsList) return;

    try {
        const response = await fetch('/api/components'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allComponents = await response.json();
        renderAvailableItems();
        
    } catch (error) {
        console.error('Failed to fetch components:', error);
        availableItemsList.innerHTML = '<p>Error loading components.</p>'; // (TRANSLATED)
    }
}

function renderAvailableItems() {
    availableItemsList.innerHTML = '';
    allComponents.forEach(item => {
        const itemElement = createItemElement(item);
        itemElement.draggable = true;
        itemElement.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('application/json', JSON.stringify(item));
            e.dataTransfer.effectAllowed = 'copy';
        });
        availableItemsList.appendChild(itemElement);
    });
}

function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'builder-item';
    itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
            <h4>${item.name}</h4>
            <p>${item.price} UAH</p> </div>
    `;
    return itemElement;
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    dropZone.classList.add('drag-over'); 
}

function handleDragLeave(e) {
    dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    if (bouquetPlaceholder) {
        bouquetPlaceholder.style.display = 'none';
    }
    if (addBouquetToCartBtn) addBouquetToCartBtn.style.display = 'none';

    const item = JSON.parse(e.dataTransfer.getData('application/json'));
    
    dropCounter++;
    const currentDropId = dropCounter;
    currentBouquetItems.push({
        dropId: currentDropId,
        name: item.name 
    });

    const img = document.createElement('img');
    img.src = item.image;
    img.className = 'dropped-item';
    img.dataset.dropId = currentDropId;
    img.addEventListener('click', handleDeleteItem);

    const dropZoneRect = dropZone.getBoundingClientRect();
    const x = e.clientX - dropZoneRect.left - 40;
    const y = e.clientY - dropZoneRect.top - 40;
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    dropZone.appendChild(img);

    if (currentBouquetItems.length >= 2) {
        calculateBtn.disabled = false;
    }
    resultDisplay.innerHTML = '';
}

function handleDeleteItem(e) {
    const imgToDelete = e.target;
    const dropIdToDelete = parseInt(imgToDelete.dataset.dropId);

    imgToDelete.remove();
    if (addBouquetToCartBtn) addBouquetToCartBtn.style.display = 'none';

    currentBouquetItems = currentBouquetItems.filter(item => {
        return item.dropId !== dropIdToDelete;
    });

    if (currentBouquetItems.length < 2) {
        calculateBtn.disabled = true;
        resultDisplay.innerHTML = '';
    }
    
    if (currentBouquetItems.length === 0 && bouquetPlaceholder) {
        bouquetPlaceholder.style.display = 'block';
    }
}

async function handleCalculateClick() {
    if (currentBouquetItems.length < 2) return;

    calculateBtn.disabled = true;
    calculateBtn.textContent = 'Calculating...'; // (TRANSLATED)
    resultDisplay.innerHTML = '';
    if (addBouquetToCartBtn) addBouquetToCartBtn.style.display = 'none';

    const componentNames = currentBouquetItems.map(item => item.name);
    const numberOfFlowers = currentBouquetItems.length;
    const totalFlowerPrice = currentBouquetItems.reduce((sum, bouquetItem) => {
        const component = allComponents.find(c => c.name === bouquetItem.name);
        if (component) {
            return sum + component.price;
        }
        return sum;
    }, 0);

    try {
        const response = await fetch('/api/build-bouquet', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ componentNames: componentNames }),
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Unknown server error');
        }
        
        const assemblyCost = result.weight;
        const complexityCharge = assemblyCost * numberOfFlowers;
        const finalBouquetPrice = totalFlowerPrice + complexityCharge;

        resultDisplay.style.color = '#370017';
        
        resultDisplay.innerHTML = `
            Assembly complexity: <b>${assemblyCost} / 10</b>
            <br>
            <span style="font-size: 0.8em;">(based on ${result.connections} connections)</span> <hr style="border:0; border-top: 1px solid #eee; margin: 10px 0;">
            <b>Flower cost:</b> ${totalFlowerPrice} UAH <br>
            <b>Complexity charge:</b> ${complexityCharge} UAH <br>
            <h3 style="margin-top: 10px; margin-bottom: 0;">Total cost: ${finalBouquetPrice} UAH</h3> `;
        
        lastCalculatedBouquetPrice = finalBouquetPrice;
        if (addBouquetToCartBtn) addBouquetToCartBtn.style.display = 'block';

    } catch (error) {
        console.error('Calculation failed:', error.message);
        resultDisplay.style.color = 'red';
        resultDisplay.textContent = `Error: ${error.message}`; // (TRANSLATED)
    }

    calculateBtn.disabled = false;
    calculateBtn.textContent = 'Calculate Bouquet Cost'; // (TRANSLATED)
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    fetchComponents(); 
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculateClick);
    }
    if (dropZone) {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
    }
    
    if (addBouquetToCartBtn) {
        addBouquetToCartBtn.addEventListener('click', () => {
            if (lastCalculatedBouquetPrice > 0) {
                const bouquetName = `My Bouquet #${bouquetNameCounter}`; // (TRANSLATED)
                
                const bouquetProduct = {
                    getId: () => `builder-${Date.now()}`,
                    getName: () => bouquetName,
                    getPrice: () => lastCalculatedBouquetPrice,
                    getImage: () => '/images/bunch.svg' 
                };

                addToCart(bouquetProduct, 1);
                bouquetNameCounter++;
                
                addBouquetToCartBtn.style.display = 'none';
                dropZone.innerHTML = '<p id="bouquet-placeholder">Drag flowers here</p>'; // (TRANSLATED)
                calculateBtn.disabled = true;
                resultDisplay.innerHTML = '';
                lastCalculatedBouquetPrice = 0;
                currentBouquetItems = [];
            } else {
                alert('Please calculate the bouquet cost first.'); // (TRANSLATED)
            }
        });
    }
});