import products from '../../backend/data/products.js';

function processShopItems(items) {
    items.forEach(item => {
        // Динамічний поліморфізм: виклик методу getDescription()
        // викликає унікальну реалізацію для кожного об'єкта.
        console.log(`- ${item.getName()}: ${item.getDescription()}`);
        if (item.isPricy()) {
            console.log(`  Це дорогий товар.`);
        } else {
            console.log(`  Це товар з помірною ціною.`);
        }
    });
}

// Використовуємо наш масив products для демонстрації
console.log("Демонстрація динамічного поліморфізму:");
processShopItems(products);