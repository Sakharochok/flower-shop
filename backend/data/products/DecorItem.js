
import { ShopItem } from './ShopItem.js';

export class DecorItem extends ShopItem {
    #material;
    
    constructor(id, name, price, image, material) {
        super(id, name, price, image);
        this.#material = material;
    }
    // Polymorphic method
    getDescription() {
        return `This decorative element is made of ${this.#material}.`;
    }
}