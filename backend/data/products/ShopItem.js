
/**
 * Base class for all items sold in the shop.
 * @class
 * @name ShopItem
 */
export class ShopItem {
    #id;
    #name;
    #price;
    #image;
    /**
     * Creates an instance of ShopItem.
     * @constructor
     * @param {number} id - Unique item identifier.
     * @param {string} name - The name of the item.
     * @param {number} price - The price of the item.
     * @param {string} image - Path to the item's image.
     */
    constructor(id, name, price, image) {
        this.#id = id;
        this.#name = name;
        this.#price = price;
        this.#image = image;
    }
    /**
     * Gets the unique ID of the item.
     * @returns {number} The item's ID.
     */
    getId() { /* ... */ }
    getId() { return this.#id; }
    getName() { return this.#name; }
    getPrice() { return this.#price; }
    getImage() { return this.#image; }
    
    /**
     * Gets a general description of the item (Polymorphic method).
     * @virtual
     * @returns {string} The item description.
     */

    // Polymorphic method: base implementation
    getDescription() {
        return "General shop item.";
    }
    /**
     * Checks if the item is expensive (price > 100).
     * @returns {boolean} True if the price is above 100.
     */
    isPricy() {
        return this.#price > 100; // Example
    }
}