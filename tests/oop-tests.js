import { Flower, Bouquet, SpecialBouquet, DecorItem, Store } from '../backend/data/products/products.js';
import { User, Order } from '../backend/data/entities/entities.js';
import { Graph } from '../backend/utils/graph.js';

// --- Test Runner ---
const describe = (description, fn) => {
    console.log(`\n--- ${description} ---`);
    fn();
};

const it = (description, fn) => {
    try {
        fn();
        console.log(`✅ PASSED: ${description}`);
    } catch (error) {
        console.error(`❌ FAILED: ${description}`);
        console.error(error.message);
        process.exit(1); // Зупинити виконання при першій помилці
    }
};

const expect = (actual) => ({
    toBe: (expected) => {
        if (actual !== expected) {
            throw new Error(`Expected ${actual} to be ${expected}`);
        }
    },
    toThrow: (expectedError) => {
        let threw = false;
        try {
            actual();
        } catch (e) {
            threw = true;
            if (!e.message.includes(expectedError)) {
                throw new Error(`Expected error message to include "${expectedError}", but got "${e.message}"`);
            }
        }
        if (!threw) {
            throw new Error('Expected function to throw, but it did not.');
        }
    },
});

// --- Test Suites ---

describe('Inheritance and Polymorphism', () => {
    const rose = new Flower(1, "Rose", 60, "img.jpg", "Red", 50);
    const weddingBouquet = new SpecialBouquet(102, "Wedding Bouquet", 1200, "img.jpg", [rose], 'Wedding');

    it('should correctly override getDescription in Flower', () => {
        expect(rose.getDescription().includes('Color: Red')).toBe(true);
    });

    it('should show three levels of inheritance in SpecialBouquet', () => {
        expect(weddingBouquet.getDescription().includes('special bouquet for a Wedding')).toBe(true);
        expect(weddingBouquet.getOccasion()).toBe('Perfect for: Wedding');
    });
});

describe('Static Polymorphism (Generics)', () => {
    const store = new Store();
    const item = new DecorItem(200, "Ribbon", 25, "img.jpg", "paper");
    const notAShopItem = new User(1, "Alice", "a@mail.com");

    it('should allow adding items that inherit from ShopItem', () => {
        store.addItem(item);
        expect(store.getTotalItemsCount()).toBe(1);
    });

    it('should throw an error when adding an item not inheriting from ShopItem', () => {
        expect(() => store.addItem(notAShopItem)).toThrow('Element must inherit from ShopItem.');
    });
});

describe('Graph Algorithms in Bouquet', () => {
    const redRose = new Flower(1, "Rose (Red)", 60, "img.jpg", "Red", 50);
    const ribbon = new DecorItem(200, "Ribbon", 25, "img.jpg", "silk");
    const customBouquet = new Bouquet(500, "Custom Bouquet", 100, "img.jpg", [redRose, ribbon]);

    const compatibilityGraph = new Graph();
    compatibilityGraph.addVertex('Rose (Red)');
    compatibilityGraph.addVertex('Ribbon');
    compatibilityGraph.addVertex('Gerbera (Pink)');
    compatibilityGraph.addEdge('Rose (Red)', 'Ribbon', 2);
    compatibilityGraph.addEdge('Rose (Red)', 'Gerbera (Pink)', 10);

    it('should find optimal connections using the provided graph', () => {
        const result = customBouquet.findOptimalFlowerConnections(compatibilityGraph, 'Kruskal');
        expect(result.weight).toBe(2);
        expect(result.algorithm).toBe('Kruskal');
    });
});

console.log("\nAll tests completed successfully!");