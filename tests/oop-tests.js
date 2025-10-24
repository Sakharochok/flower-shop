// --- Imports ---
// ... (всі імпорти, як і раніше) ...
import { Flower, Bouquet, SpecialBouquet, DecorItem, Store, ShopItem } from '../backend/data/products/products.js';
import { User, Order, Payment, Shipping, NovaPoshtaShipping } from '../backend/data/entities/entities.js';
import { Graph } from '../backend/utils/graph.js';

// --- Test Runner ---
// ... (код describe, it, expect, як і раніше) ...
const describe = (description, fn) => {
    console.log(`\n--- ${description} ---`);
    fn();
};

const it = (description, fn) => {
    try {
        fn();
        console.log(`PASSED: ${description}`);
    } catch (error) {
        console.error(`FAILED: ${description}`);
        console.error(error.message);
        process.exit(1); // Stop execution on first error
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

// (User's Original Tests - Translated)
// ... (код describe 'Inheritance', 'Store', 'Graph', як і раніше) ...
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

describe('Static Polymorphism (Generics) - Store', () => {
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

// (Added Tests - Translated)

describe('Class: User', () => {
    // ... (код describe 'User', як і раніше) ...
    it('should correctly create a user and generate a welcome message', () => {
        const user = new User(1, 'Sofiia', 'sofiia@example.com');

        // Base functionality check
        expect(user.getName()).toBe('Sofiia');
        expect(user.getEmail()).toBe('sofiia@example.com');
        expect(user.generateWelcomeMessage()).toBe('Welcome, Sofiia!');
    });

    it('should correctly set a valid shipping address', () => {
        const user = new User(2, 'Test', 'test@example.com');
        const result = user.setShippingAddress('Kyiv, Khreshchatyk St, 1');

        expect(result).toBe(true);
        expect(user.getShippingAddress()).toBe('Kyiv, Khreshchatyk St, 1');
    });

    it('should not set an address that is too short (boundary case)', () => {
        // Boundary/exception case check
        const user = new User(3, 'Test 2', 'test2@example.com');
        const result = user.setShippingAddress('123'); // < 5 chars

        expect(result).toBe(false);
        expect(user.getShippingAddress()).toBe(null);
    });
});

// <<< НОВИЙ КОД ДЛЯ ЦЬОГО КРОКУ >>>
describe('Class: Order', () => {
    let order;
    let user;

    // Create "clean" objects before each test
    const beforeEach = () => {
        user = new User(1, 'Test User', 'test@mail.com');
        order = new Order(101, user);
    };

    it('should correctly calculate the total (calculateTotal)', () => {
        beforeEach();
        // Mock item objects that have price and quantity
        order.addItem({ price: 100, quantity: 2 });
        order.addItem({ price: 50, quantity: 1 });

        expect(order.calculateTotal()).toBe(250);
    });

    it('should return 0 if the cart is empty', () => {
        beforeEach();
        expect(order.calculateTotal()).toBe(0);
    });

    it('should correctly update the status', () => {
        beforeEach();
        expect(order.updateStatus('shipped')).toBe(true);
        expect(order.getStatus()).toBe('shipped');
    });

    it('should not update to an invalid status (boundary case)', () => {
        beforeEach();
        // Exception case check
        expect(order.updateStatus('cancelled')).toBe(false);
        expect(order.getStatus()).toBe('pending');
    });
});

describe('Class: Payment', () => {

    it('should correctly process a payment', () => {
        const payment = new Payment(201, 150, 'card');

        expect(payment.isPaid()).toBe(false);
        const result = payment.processPayment();

        expect(result).toBe(true);
        expect(payment.isPaid()).toBe(true);
    });

    it('should not process a payment twice', () => {
        const payment = new Payment(202, 100, 'card');
        payment.processPayment(); // First payment

        // Second attempt
        const result = payment.processPayment();

        expect(result).toBe(false);
        expect(payment.isPaid()).toBe(true);
    });

    it('should correctly identify the payment method (isCardPayment)', () => {
        const cardPayment = new Payment(203, 50, 'card');
        const cashPayment = new Payment(204, 50, 'cash');

        expect(cardPayment.isCardPayment()).toBe(true);
        expect(cashPayment.isCardPayment()).toBe(false);
    });
});