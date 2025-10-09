
// This module defines the Store container class, demonstrating Static Polymorphism (Generics).

// Import the base class to ensure type checking in addItem method
import { ShopItem } from './ShopItem.js'; 

// --- Container class for Static Polymorphism (Generics) ---
export class Store {
    #items;
    
    constructor() {
        this.#items = [];
    }
    
    // Non-trivial method: Adds an item with type check
    // This method ensures only objects inheriting from ShopItem can be stored.
    addItem(item) {
        if (item instanceof ShopItem) {
            this.#items.push(item);
        } else {
            // Protection: throws an error if trying to add something that is not a ShopItem
            throw new Error("Element must inherit from ShopItem."); 
        }
    }
    
    // Non-trivial method: Returns the total number of elements
    getTotalItemsCount() {
        return this.#items.length;
    }

    // Non-trivial method: Clears the store items
    clearItems() {
        const count = this.#items.length;
        this.#items = [];
        return count;
    }
    
    // Non-trivial method: Finds an item by its ID
    getItemById(id) {
        return this.#items.find(item => item.getId() === id);
    }
}