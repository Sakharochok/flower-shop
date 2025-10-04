// backend/data/products.js
import { Graph } from '../utils/graph.js'; 
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
}

// --- Hierarchy 1: Flowers and Bouquets ---

export class Flower extends ShopItem {
    #color;
    #stemLength;
    
    // Constructor
    constructor(id, name, price, image, color, stemLength) { 
        super(id, name, price, image);
        this.#color = color;
        this.#stemLength = stemLength;
    }

    // Non-trivial method: Checks suitability for a tall vase
    isSuitableForTallVase() {
        return this.#stemLength >= 40;
    }
    
    // Polymorphic method: description for a flower
    getDescription() {
        return `Color: ${this.#color}. Stem length: ${this.#stemLength} cm.`;
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

    // Non-trivial method: Calculates the total bouquet price
    calculateBouquetPrice() {
        // ... (calculation logic remains the same)
        const basePrice = this.getPrice();
        const flowersPrice = this.#flowers.reduce((sum, flower) => sum + flower.getPrice(), 0);
        return basePrice + flowersPrice;
    }

    // Non-trivial method: Adds a flower
    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }

    // NEW NON-TRIVIAL METHOD: Uses Graph logic for complex optimization
    // Finds the Minimum Spanning Tree (MST) of flowers in the bouquet
    findOptimalFlowerConnections(graph, algorithmName = 'Kruskal') {
        const flowerNames = this.#flowers.map(f => f.getName());
        
        // 1. Build a subgraph containing only the bouquet's flowers
        const subGraph = new Graph(); // Assuming Graph is imported or available

        for (const name of flowerNames) {
            subGraph.addVertex(name);
        }
        
        // 2. Add only relevant edges from the full Graph (simulated compatibility costs)
        // This part needs access to the full graph's edges (implementation detail simplified here)
        // For demonstration, we'll manually add edges assuming a compatibility cost:
        
        // Example: Add a few fixed edges (for demonstration purposes only)
        if (flowerNames.includes('Rose (Red)') && flowerNames.includes('Ribbon')) {
            subGraph.addEdge('Rose (Red)', 'Ribbon', 2); // Low cost = high compatibility
        }
        if (flowerNames.includes('Rose (Red)') && flowerNames.includes('Gerbera (Pink)')) {
            subGraph.addEdge('Rose (Red)', 'Gerbera (Pink)', 10); // Medium cost
        }

        if (subGraph.getVertices().length < 2) {
            return { mst: [], weight: 0, algorithm: algorithmName };
        }

        // 3. Apply the chosen MST algorithm (Polymorphism example: different algorithms for the same task)
        let result;
        if (algorithmName === 'Prim') {
            const startNode = subGraph.getVertices()[0];
            result = subGraph.primMST(startNode);
        } else { // Default to Kruskal
            result = subGraph.kruskalMST();
        }

        return { mst: result.mst, weight: result.weight, algorithm: algorithmName };
    }
    
    // ... (getDescription method remains the same)
}

export class DecorItem extends ShopItem {
    #material;
    
    constructor(id, name, price, image, material) {
        super(id, name, price, image);
        this.#material = material;
    }

    // Non-trivial method: Checks for eco-friendliness
    isEcoFriendly() {
        return this.#material === 'wood' || this.#material === 'paper';
    }
    
    // Polymorphic method: description for decor
    getDescription() {
        return `This decorative element is made of ${this.#material}.`;
    }
}
// --- Container class for Static Polymorphism (Generics) ---
export class Store {
    #items;
    constructor() {
        this.#items = [];
    }
    
    // Non-trivial method: Adds an item with type check
    addItem(item) {
        if (item instanceof ShopItem) {
            this.#items.push(item);
        } else {
            // Protection: throws an error if trying to add something that is not a ShopItem
            throw new Error("Element must inherit from ShopItem."); 
        }
    }
    
    // Non-trivial method: Returns the total number of elements
    getTotalItemsCount() {
        return this.#items.length;
    }
}

// =========================================================================
// PRODUCTS ARRAY (Example list of flowers and items)
// =========================================================================

const products = [
    // --- ROSES ---
    new Flower(1, "Rose (Red)", 60, "/images/roses/rose_red.jpg", "Red", 50),
    new Flower(2, "Rose (White)", 55, "/images/roses/rose_white.jpg", "White", 45),
    new Flower(3, "Rose (Pink)", 58, "/images/roses/rose_pink.jpg", "Pink", 55),
    new Flower(4, "Rose (Cream)", 62, "/images/roses/rose_cream.jpg", "Cream", 50),
    new Flower(5, "Bush Rose (Pink-White)", 45, "/images/roses/rose_bush_pb.jpg", "Pink-White", 30),
    
    // --- GERBERAS ---
    new Flower(6, "Gerbera (Pink)", 40, "/images/gerbera/gerbera_pink.jpg", "Pink", 45),
    new Flower(7, "Gerbera (Yellow)", 42, "/images/gerbera/gerbera_yellow.jpg", "Yellow", 40),
    new Flower(8, "Gerbera (Orange)", 43, "/images/gerbera/gerbera_orange.jpg", "Orange", 50),

    // --- DAISIES ---
    new Flower(9, "Daisy (Field)", 25, "/images/other/daisy_field.jpg", "White", 30),

    // --- HYDRANGEAS ---
    new Flower(10, "Hydrangea (Pink)", 120, "/images/hydrangea/hydrangea_pink.jpg", "Pink", 60),
    new Flower(11, "Hydrangea (Blue)", 130, "/images/hydrangea/hydrangea_blue.jpg", "Blue", 65),
    new Flower(12, "Hydrangea (White)", 125, "/images/hydrangea/hydrangea_white.jpg", "White", 55),

    // --- DIANTHUS AND CHRYSANTHEMUMS ---
    new Flower(13, "Dianthus (Pink)", 30, "/images/dianthus/dianthus_pink.jpg", "Pink", 35),
    new Flower(14, "Dianthus (White)", 32, "/images/dianthus/dianthus_white.jpg", "White", 30),
    new Flower(15, "Chrysanthemum (White)", 48, "/images/chrysanthemum/chrysanthemum_white.jpg", "White", 50),
    new Flower(16, "Chrysanthemum (Pink)", 49, "/images/chrysanthemum/chrysanthemum_pink.jpg", "Pink", 55),

    // --- Bouquets and Decor Examples ---
    new Bouquet(100, "Bouquet 'Tenderness'", 350, "/images/bouquets/bouquet_tenderness.jpg", []), 
    new DecorItem(200, "Silk Ribbon", 25, "/images/decor/ribbon_silk.jpg", "paper"),
];

// Exporting the products array to be available in main.js
export { products };