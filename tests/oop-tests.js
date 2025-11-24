// --- Imports ---
import { Flower, Bouquet, SpecialBouquet, DecorItem, Store, ShopItem } from '../backend/data/products/products.js';
import { User, Order, Payment, Shipping, NovaPoshtaShipping } from '../backend/data/entities/entities.js';
import { Graph } from '../backend/utils/graph.js';

/**
 * Module containing unit tests for OOP and core business logic.
 * @module oop-tests
 */
// --- Test Runner ---
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


describe('Class: User', () => {

    it('should correctly create a user and generate a welcome message', () => {
        const user = new User(1, 'Sofiia', 'sofiia@example.com');
        
        // Base functionality check
        expect(user.getName()).toBe('Sofiia');
        expect(user.getEmail()).toBe('sofiia@example.com');
        expect(user.generateWelcomeMessage()).toBe('Welcome, Sofiia!');
    });

    it('should return true and update address if input is valid', () => {
        const user = new User(2, 'Test', 'test@example.com');
        const result = user.setShippingAddress('Kyiv, Khreshchatyk St, 1');
        
        expect(result).toBe(true);
        expect(user.getShippingAddress()).toBe('Kyiv, Khreshchatyk St, 1');
    });

    it('should return false and not update address if input is too short (< 5 chars)', () => {
        // Boundary/exception case check
        const user = new User(3, 'Test 2', 'test2@example.com');
        const result = user.setShippingAddress('123'); // < 5 chars
        
        expect(result).toBe(false);
        expect(user.getShippingAddress()).toBe(null);
    });
});

describe('Class: Order', () => {
    let order;
    let user;

    // Create "clean" objects before each test
    const beforeEach = () => {
        user = new User(1, 'Test User', 'test@mail.com');
        order = new Order(101, user);
    };

    it('should correctly calculate total based on item price and quantity', () => {
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

    it('should return false and not update status if newStatus is invalid (e.g., "cancelled")', () => {
        beforeEach();
        // Exception case check
        expect(order.updateStatus('cancelled')).toBe(false);
        expect(order.getStatus()).toBe('pending');
    });
});

describe('Class: Payment', () => {

    it('should set isPaid to true and return true on first payment', () => {
        const payment = new Payment(201, 150, 'card');
        
        expect(payment.isPaid()).toBe(false);
        const result = payment.processPayment();
        
        expect(result).toBe(true);
        expect(payment.isPaid()).toBe(true);
    });

    it('should return false and not change state if already paid', () => { 
        const payment = new Payment(202, 100, 'card');
        payment.processPayment(); // First payment
        
        // Second attempt
        const result = payment.processPayment();
        
        expect(result).toBe(false);
        expect(payment.isPaid()).toBe(true);
    });

    it('should return true for "card" method and false for other methods (e.g., "cash")', () => { 
        const cardPayment = new Payment(203, 50, 'card');
        const cashPayment = new Payment(204, 50, 'cash');
        
        expect(cardPayment.isCardPayment()).toBe(true);
        expect(cashPayment.isCardPayment()).toBe(false);
    });
});

describe('Abstract Class: Shipping', () => {

    it('should not allow instantiation of the abstract Shipping class (exception case)', () => {
        // Exception case check
        expect(() => new Shipping(1, 'Address')).toThrow('Abstract class Shipping cannot be instantiated directly.');
    });

    it('should force child classes to implement calculateCost', () => {
        // Create a "bad" child class without implementation
        class BadShipping extends Shipping {}
        const badShip = new BadShipping(2, 'Address');

        expect(() => badShip.calculateCost()).toThrow('Method calculateCost() must be implemented');
    });

    it('NovaPoshtaShipping: should return fixed cost of 80 (Polymorphism)', () => {
        const npShipping = new NovaPoshtaShipping(10, 'Lviv', 5);
        
        // NovaPoshtaShipping has its own implementation of calculateCost
        expect(npShipping.calculateCost()).toBe(80);
    });
});

describe('Class: Flower', () => {

    it('should correctly determine if suitable for a tall vase (isSuitableForTallVase)', () => {
        const tallRose = new Flower(1, "Rose", 60, "img.jpg", "Red", 50); // >= 40
        const shortRose = new Flower(2, "Rose", 60, "img.jpg", "Red", 39); // < 40
        
        expect(tallRose.isSuitableForTallVase()).toBe(true);
        expect(shortRose.isSuitableForTallVase()).toBe(false);
    });

    it('should return true for isSuitableForTallVase at exact boundary (40cm)', () => { 
        // Boundary case check
        const boundaryRose = new Flower(3, "Rose", 60, "img.jpg", "Red", 40); // == 40
        expect(boundaryRose.isSuitableForTallVase()).toBe(true);
    });
});

describe('Class: ShopItem (Base Class)', () => {

    it('should return the base description', () => {
        const item = new ShopItem(1, 'Item', 10, 'img.jpg');
        expect(item.getDescription()).toBe('General shop item.');
    });

    it('should correctly identify a pricy item (isPricy)', () => {
        const pricyItem = new ShopItem(2, 'Pricy', 150, 'img.jpg'); // > 100
        expect(pricyItem.isPricy()).toBe(true);
    });

    it('should return false for isPricy at exact boundary (100)', () => { // 
        const boundaryItem = new ShopItem(3, 'Boundary', 100, 'img.jpg'); // == 100
        const cheapItem = new ShopItem(4, 'Cheap', 99, 'img.jpg'); // < 100
        
        expect(boundaryItem.isPricy()).toBe(false);
        expect(cheapItem.isPricy()).toBe(false);
    });
});

describe('Class: DecorItem & Bouquet (Subclasses)', () => {

    it('DecorItem: should return description with material (Polymorphism)', () => {
        const ribbon = new DecorItem(200, "Silk Ribbon", 25, "img.jpg", "silk");
        expect(ribbon.getDescription()).toBe('This decorative element is made of silk.');
    });

    it('Bouquet: should correctly add a flower (addFlower)', () => {
        const rose = new Flower(1, "Rose", 60, "img.jpg", "Red", 50);
        const bouquet = new Bouquet(100, "Test Bouquet", 150, "img.jpg", []);
        
        bouquet.addFlower(rose);
        // Check if the description updated
        expect(bouquet.getDescription()).toBe('A beautiful collection of 1 flowers.');
    });

    it('SpecialBouquet: should inherit the isPricy method (Inheritance)', () => {
        const weddingBouquet = new SpecialBouquet(102, "Wedding Bouquet", 1200, "img.jpg", [], 'Wedding');
        
        // isPricy() is defined in ShopItem, but should work here
        expect(weddingBouquet.isPricy()).toBe(true);
    });
});


describe('Advanced Error Handling & Edge Cases', () => {


        const user = new User(1, 'Test User', 'test@mail.com');
        const order = new Order(101, user);
        order.addItem({ price: 10, quantity: 1_000_000 });
        expect(order.calculateTotal()).toBe(10_000_000);
    });

    it('Order: should handle zero quantity items', () => {
        const user = new User(1, 'Test User', 'test@mail.com');
        const order = new Order(101, user);
        order.addItem({ price: 100, quantity: 0 });
        expect(order.calculateTotal()).toBe(0);
    });

    it('User: should reject non-string inputs for shipping address', () => {
 
        const user = new User(4, 'Test 3', 'test3@example.com');
        expect(user.setShippingAddress(null)).toBe(false);
        expect(user.setShippingAddress(123456)).toBe(false);
        expect(user.getShippingAddress()).toBe(null);
    });

    it('NovaPoshtaShipping: should handle constructor with various inputs', () => {
    
        // This test checks that the constructor doesn't "crash" with strange data
        const shipping = new NovaPoshtaShipping(1, null, 999);
        expect(shipping.getAddress()).toBe(null);
        expect(shipping.calculateCost()).toBe(80); // Cost logic does not depend on the address
    });

console.log("\nAll tests completed successfully!");