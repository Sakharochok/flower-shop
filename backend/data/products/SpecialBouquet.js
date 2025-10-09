import { Bouquet } from './bouquet.js';

// Class for special, themed bouquets (3rd level of hierarchy)
export class SpecialBouquet extends Bouquet {
    #occasion; // e.g., 'Wedding', 'Birthday'

    constructor(id, name, price, image, flowers, occasion) {
        super(id, name, price, image, flowers);
        this.#occasion = occasion;
    }

    // Overridden polymorphic method
    getDescription() {
        const baseDescription = super.getDescription();
        return `${baseDescription} This is a special bouquet for a ${this.#occasion}.`;
    }

    // Non-trivial method
    getOccasion() {
        return `Perfect for: ${this.#occasion}`;
    }
}