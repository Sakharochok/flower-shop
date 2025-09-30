// backend/data/products.js

// --- Клас-предок для всіх товарів (ShopItem) ---
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
    
    // Поліморфний метод: базова реалізація
    getDescription() {
        return "Загальний товар магазину.";
    }
}

// --- Ієрархія 1: Квіти та Букети ---

export class Flower extends ShopItem {
    #color;
    #stemLength;
    
    // Конструктор: БЕЗ свіжості
    constructor(id, name, price, image, color, stemLength) { 
        super(id, name, price, image);
        this.#color = color;
        this.#stemLength = stemLength;
    }

    // Нетривіальний метод: Перевірка придатності для високої вази
    isSuitableForTallVase() {
        return this.#stemLength >= 40;
    }
    
    // Поліморфний метод: опис для квітки
    getDescription() {
        return `Колір: ${this.#color}. Довжина стебла: ${this.#stemLength} см.`;
    }
}

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;
    
    constructor(id, name, price, image, flowers) {
        super(id, name, price, image);
        this.#flowers = flowers;
        this.#isCustom = false;
    }

    // Нетривіальний метод: Розрахунок ціни букета (базова ціна + ціна квітів)
    calculateBouquetPrice() {
        const basePrice = this.getPrice();
        const flowersPrice = this.#flowers.reduce((sum, flower) => sum + flower.getPrice(), 0);
        return basePrice + flowersPrice;
    }

    // Нетривіальний метод: Додавання квітки
    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }
    
    // Поліморфний метод: опис для букета
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

    // Нетривіальний метод: Перевірка на екологічність
    isEcoFriendly() {
        return this.#material === 'wood' || this.#material === 'paper';
    }
    
    // Поліморфний метод: опис для декору
    getDescription() {
        return `Цей декоративний елемент виготовлений з ${this.#material}.`;
    }
}

// --- Клас-контейнер для демонстрації статичного поліморфізму (Generics) ---
export class Store {
    #items;
    constructor() {
        this.#items = [];
    }
    
    // Нетривіальний метод: Додавання елементу з перевіркою типу
    addItem(item) {
        if (item instanceof ShopItem) {
            this.#items.push(item);
        } else {
            // Захист: кидаємо помилку, якщо додаємо щось, що не є товаром
            throw new Error("Елемент повинен успадковувати від ShopItem."); 
        }
    }
    
    // Нетривіальний метод: Повертає загальну кількість
    getTotalItemsCount() {
        return this.#items.length;
    }
}

// =========================================================================
// МАСИВ ТОВАРІВ (products): МІСЦЕ ДЛЯ ВАШИХ ФОТОГРАФІЙ
// =========================================================================

const products = [
    // ---------------------------------------------------------------------
    //                                 !!! МІСЦЕ ДЛЯ ФОТО !!!
    //                                 ПРИКЛАД: "/images/roses/rose_red.jpg"
    // ---------------------------------------------------------------------

    // --- ТРОЯНДИ (60 грн) ---
    new Flower(1, "Троянда (Червона)", 60, "/images/roses/rose_red.jpg", "Червоний", 50),
    new Flower(2, "Троянда (Біла)", 55, "/images/roses/rose_white.jpg", "Білий", 45),
    new Flower(3, "Троянда (Рожева)", 58, "/images/roses/rose_pink.jpg", "Рожевий", 55),
    new Flower(4, "Троянда (Кремова)", 62, "/images/roses/rose_cream.jpg", "Кремовий", 50),
    new Flower(5, "Троянда Кущова (Рож.-Біл.)", 45, "/images/roses/rose_bush_pb.jpg", "Рожево-білий", 30),
    
    // --- ГЕРБЕРИ (40-43 грн) ---
    new Flower(6, "Гербера (Рожева)", 40, "/images/gerbera/gerbera_pink.jpg", "Рожевий", 45),
    new Flower(7, "Гербера (Жовта)", 42, "/images/gerbera/gerbera_yellow.jpg", "Жовтий", 40),
    new Flower(8, "Гербера (Оранжева)", 43, "/images/gerbera/gerbera_orange.jpg", "Оранжевий", 50),

    // --- РОМАШКИ (25 грн) ---
    new Flower(9, "Ромашка (Польова)", 25, "/images/other/daisy_field.jpg", "Білий", 30),

    // --- ГОРТЕНЗІЇ (120-130 грн) ---
    new Flower(10, "Гортензія (Рожева)", 120, "/images/hydrangea/hydrangea_pink.jpg", "Рожевий", 60),
    new Flower(11, "Гортензія (Голуба)", 130, "/images/hydrangea/hydrangea_blue.jpg", "Голубий", 65),
    new Flower(12, "Гортензія (Біла)", 125, "/images/hydrangea/hydrangea_white.jpg", "Білий", 55),

    // --- ДІАНТУСИ ТА ХРИЗАНТЕМИ (30-49 грн) ---
    new Flower(13, "Діантус (Рожевий)", 30, "/images/dianthus/dianthus_pink.jpg", "Рожевий", 35),
    new Flower(14, "Діантус (Білий)", 32, "/images/dianthus/dianthus_white.jpg", "Білий", 30),
    new Flower(15, "Хризантема (Біла)", 48, "/images/chrysanthemum/chrysanthemum_white.jpg", "Білий", 50),
    new Flower(16, "Хризантема (Рожева)", 49, "/images/chrysanthemum/chrysanthemum_pink.jpg", "Рожевий", 55),

    // --- Приклади Букетів та Декору ---
    // У цей букет ви можете додати квіти, коли будете тестувати логіку
    new Bouquet(100, "Букет 'Ніжність'", 350, "/images/bouquets/bouquet_tenderness.jpg", []), 
    new DecorItem(200, "Шовкова стрічка", 25, "/images/decor/ribbon_silk.jpg", "paper"),
];

// Експортуємо масив товарів, щоб він був доступний у main.js
export { products };