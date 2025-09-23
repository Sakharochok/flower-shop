// --- Клас-предок для всіх товарів ---
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
    getDescription() {
        return "Цей товар належить до категорії 'Загальні товари'."
    }
}

// --- Ієрархія 1: Квіти та Букети ---
export class Flower extends ShopItem {
    #color;
    #stemLength;
    constructor(id, name, price, image, color, stemLength) {
        super(id, name, price, image);
        this.#color = color;
        this.#stemLength = stemLength;
    }
    // Нетривіальний метод
    // Перевіряє, чи довжина стебла підходить для великої вази
    isSuitableForTallVase() {
        return this.#stemLength >= 40;
    }
    getDescription() {
        return `Це окрема квітка ${this.getName()} з кольором ${this.#color}.`;
    }
        isPricy() {
        return this.getPrice() > 100;
    }
    getDescription() {
        return `Це окрема квітка ${this.getName()} з кольором ${this.#color}.`;
    }
}

export class Bouquet extends ShopItem {
    #flowers; // Масив об'єктів Flower
    #isCustom;
    constructor(id, name, price, image, flowers) {
        super(id, name, price, image);
        this.#flowers = flowers;
        this.#isCustom = false;
    }
    // Нетривіальний метод
    calculateBouquetPrice() {
        const basePrice = this.getPrice();
        const flowersPrice = this.#flowers.reduce((sum, flower) => sum + flower.getPrice(), 0);
        return basePrice + flowersPrice;
    }
    // Нетривіальний метод
    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }
    getDescription() {
        return `Цей букет складається з ${this.#flowers.length} квітів.`;
    }
        isPricy() {
        return this.getPrice() > 500;
    }
    getDescription() {
        return `Цей букет складається з ${this.#flowers.length} квітів.`;
    }
}

// --- Ієрархія 2: Декор ---
export class DecorItem extends ShopItem {
    #material;
    constructor(id, name, price, image, material) {
        super(id, name, price, image);
        this.#material = material;
    }
    // Нетривіальний метод
    isEcoFriendly() {
        return this.#material === 'wood' || this.#material === 'paper';
    }
    getDescription() {
        return `Цей декоративний елемент виготовлений з ${this.#material}.`;
    }
        isPricy() {
        return this.getPrice() > 50;
    }
    getDescription() {
        return `Цей декоративний елемент виготовлений з ${this.#material}.`;
    }
}

export class Store {
    #items;
    constructor() {
        this.#items = [];
    }
    addItem(item) {
        // Залишаємо перевірку, щоб забезпечити безпеку
        if (item instanceof ShopItem) {
            this.#items.push(item);
        } else {
            throw new Error("Елемент повинен успадковувати від ShopItem.");
        }
    }
    getTotalItemsCount() {
        return this.#items.length;
    }
}

// --- Створюємо екземпляри класів ---
const products = [
    new Flower(1, "Біла троянда", 50, "https://i.imgur.com/rose.jpg", "білий", 50),
    new Flower(2, "Червоний тюльпан", 30, "https://i.imgur.com/tulip.jpg", "червоний", 35),
    new Bouquet(3, "Класичний букет", 150, "https://i.imgur.com/bouquet.jpg", [
        new Flower(10, "Біла троянда", 50, "...", "білий", 50),
        new Flower(11, "Біла троянда", 50, "...", "білий", 50),
        new Flower(12, "Біла троянда", 50, "...", "білий", 50),
    ]),
    new DecorItem(4, "Паперова стрічка", 25, "https://i.imgur.com/ribbon.jpg", "paper"),
];

export default products;