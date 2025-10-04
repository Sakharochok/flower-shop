import products from '../../backend/data/products.js';

function processShopItems(items) {
    items.forEach(item => {
        // Dynamic polymorphism: calling the getDescription() method
        // invokes the unique implementation for each object.
        console.log(`- ${item.getName()}: ${item.getDescription()}`);
        
        // Example of conditional logic based on a polymorphic method
        if (item.isPricy()) {
            console.log(`  This is an expensive item.`);
        } else {
            console.log(`  This is a moderately priced item.`);
        }
    });
}

// Using our products array for demonstration
console.log("Demonstration of dynamic polymorphism:");
processShopItems(products);