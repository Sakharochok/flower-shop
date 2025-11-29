/**
 * Module demonstrating the concept of dynamic polymorphism 
 * by iterating over a heterogeneous array of ShopItem derivatives.
 * @module polymorphism-example
 */
import products from '../../backend/data/products.js';

/**
 * Iterates over a collection of shop items and demonstrates polymorphism 
 * by calling their unique getDescription() and isPricy() methods.
 * @function
 * @param {Array<ShopItem>} items - An array of objects inheriting from ShopItem.
 */
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