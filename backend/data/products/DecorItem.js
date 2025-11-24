
import { ShopItem } from './ShopItem.js';
/**
 * Class representing a decorative shop item (e.g., ribbon, vase).
 * @class
 * @extends ShopItem
 */
export class DecorItem extends ShopItem {
    #material;
    /**
     * Creates an instance of DecorItem.
     * @constructor
     * @param {number} id - ID.
     * @param {string} name - Name.
     * @param {number} price - Price.
     * @param {string} image - Image path.
     * @param {string} material - The primary material of the item.
     */
    constructor(id, name, price, image, material) {
        super(id, name, price, image);
        this.#material = material;
    }
    /**
     * Returns a detailed description.
     * @override
     * @returns {string} Description indicating the material.
     */
    // Polymorphic method
    getDescription() {
        return `This decorative element is made of ${this.#material}.`;
    }
}