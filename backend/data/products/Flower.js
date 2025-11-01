// backend/data/products/Flower.js

import { ShopItem } from './ShopItem.js';

export class Flower extends ShopItem {
    #color;
    #stemLength;
    
    constructor(id, name, price, image, color, stemLength) { 
        super(id, name, price, image);
        this.#color = color;
        this.#stemLength = stemLength;
    }
    // Non-trivial method
    isSuitableForTallVase() {
        return this.#stemLength >= 40;
    }
    // Polymorphic method
    getDescription() {
        return `Color: ${this.#color}. Stem length: ${this.#stemLength} cm.`;
    }
}