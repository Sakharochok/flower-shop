import { Bouquet } from './Bouquet.js';
/**
 * Class for special, themed bouquets (e.g., Wedding, Birthday).
 * @class
 * @extends Bouquet
 */
// Class for special, themed bouquets (3rd level of hierarchy)
export class SpecialBouquet extends Bouquet {
    #occasion; // e.g., 'Wedding', 'Birthday'
    /**
     * Creates a SpecialBouquet instance.
     * @param {number} id - ID.
     * @param {string} name - Name.
     * @param {number} price - Price.
     * @param {string} image - Image path.
     * @param {Array<Flower>} flowers - Flowers in the bouquet.
     * @param {string} occasion - The theme or occasion of the bouquet.
     */
    constructor(id, name, price, image, flowers, occasion) {
        super(id, name, price, image, flowers);
        this.#occasion = occasion;
    }
    /**
     * Returns a full description including the occasion.
     * @override
     * @returns {string} The full description.
     */
    // Overridden polymorphic method
    getDescription() {
        const baseDescription = super.getDescription();
        return `${baseDescription} This is a special bouquet for a ${this.#occasion}.`;
    }
    /**
     * Gets the recommended occasion.
     * @returns {string} The formatted occasion string.
     */
    // Non-trivial method
    getOccasion() {
        return `Perfect for: ${this.#occasion}`;
    }
}