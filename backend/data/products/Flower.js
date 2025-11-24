import { ShopItem } from './ShopItem.js';
/**
 * Class representing a single Flower item.
 * @class
 * @extends ShopItem
 */

export class Flower extends ShopItem {
    #color;
    #stemLength;
    /**
     * Creates a Flower instance.
     * @param {number} id - ID.
     * @param {string} name - Name.
     * @param {number} price - Price.
     * @param {string} image - Image path.
     * @param {string} color - The color of the flower.
     * @param {number} stemLength - The length of the stem in cm.
     */
    
    constructor(id, name, price, image, color, stemLength) { 
        super(id, name, price, image);
        this.#color = color;
        this.#stemLength = stemLength;
    }
    /**
     * Checks if the flower is suitable for a tall vase.
     * @method
     * @returns {boolean} True if stem length is 40cm or more.
     * @example
     * const rose = new Flower(1, 'Rose', 50, 'img.png', 'Red', 50);
     * rose.isSuitableForTallVase(); // returns true
     */
    // Non-trivial method
    isSuitableForTallVase() {
        return this.#stemLength >= 40;
    }
    /**
     * Returns a detailed description of the flower.
     * @override
     * @returns {string} Description including color and stem length.
     */
    // Polymorphic method
    getDescription() {
        return `Color: ${this.#color}. Stem length: ${this.#stemLength} cm.`;
    }
}