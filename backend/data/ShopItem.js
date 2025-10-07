
// --- Base class for all shop items (ShopItem) ---
export class ShopItem {
    #id;
    #name;
    #price;
    #image;
    constructor(id, name, price, image) {
        this.#id = id;
        this.#name = name;
        this.#price = price;
        this.#image = image;
    }
    getId() { return this.#id; }
    getName() { return this.#name; }
    getPrice() { return this.#price; }
    getImage() { return this.#image; }
    
    // Polymorphic method: base implementation
    getDescription() {
        return "General shop item.";
    }
    isPricy() {
        return this.#price > 100; // Example
    }
}