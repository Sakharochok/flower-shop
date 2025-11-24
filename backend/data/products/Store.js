// This module defines the Store container class, demonstrating Static Polymorphism (Generics).

import { ShopItem } from './ShopItem.js'; 
/**
 * Container class (Store) for holding shop items.
 * Demonstrates the concept of Static Polymorphism (Generics).
 * @class
 */
// --- Container class for Static Polymorphism (Generics) ---
export class Store {
    #items;
    /**
     * @constructor
     */
    constructor() {
        this.#items = [];
    }
    /**
     * Adds an item to the store with a type check.
     * @method
     * @param {ShopItem} item - An element that inherits from ShopItem.
     * @throws {Error} If the element does not inherit from ShopItem.
     */

    // Non-trivial method: Adds an item with type check
    addItem(item) {
        if (item instanceof ShopItem) {
            this.#items.push(item);
        } else {
            // Protection: throws an error if trying to add something that is not a ShopItem
            throw new Error("Element must inherit from ShopItem."); 
        }
    }
    /**
     * Returns the total number of elements in the store.
     * @returns {number} The count of items.
     */
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