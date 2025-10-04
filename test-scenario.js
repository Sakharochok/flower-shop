// test-scenario.js

// Import all necessary classes
import { User, Order, Payment, NovaPoshtaShipping } from './backend/data/entities.js';
import { Flower, Bouquet, DecorItem } from './backend/data/products.js';

// --- Demonstration of client-side code ---

console.log("--- Scenario: Placing an order in the flower shop ---");

// 1. Object Creation
console.log("\n1. Creating objects: user, flowers, ribbon.");
const user = new User(1, "Ivan Petrenko", "ivan.petrenko@example.com");
user.setShippingAddress("Kyiv, Shevchenko Str., 10");

const rose = new Flower(1, "Red Rose", 50, "url_rose.jpg", "red", 60);
const lily = new Flower(2, "White Lily", 45, "url_lily.jpg", "white", 45);
const ribbon = new DecorItem(4, "Silk Ribbon", 25, "url_ribbon.jpg", "silk");

// 2. Order Creation
console.log("\n2. Creating a new order for the user.");
const order = new Order(101, user);
order.addItem({ id: rose.getId(), name: rose.getName(), price: rose.getPrice(), quantity: 5 });
order.addItem({ id: lily.getId(), name: lily.getName(), price: lily.getPrice(), quantity: 2 });
order.addItem({ id: ribbon.getId(), name: ribbon.getName(), price: ribbon.getPrice(), quantity: 1 });

// 3. Calculation and Payment
console.log("\n3. Calculating the order total and creating the payment.");
const totalAmount = order.calculateTotal();
console.log(`Total order amount: ${totalAmount} UAH`);

const payment = new Payment(201, totalAmount, 'card');
payment.processPayment(); // Non-trivial method call
console.log(`Payment status: ${payment.isPaid() ? "Paid" : "Not Paid"}`);

// 4. Demonstration of Polymorphism (Shipping)
console.log("\n4. Demonstration of Polymorphism for Shipping.");
const shipping = new NovaPoshtaShipping(301, user.getShippingAddress(), 15);
const shippingCost = shipping.calculateCost(); // Dynamic Polymorphism is used here
const trackingNumber = shipping.generateTrackingNumber(); // Non-trivial method

console.log(`Shipping cost: ${shippingCost} UAH`);
console.log(`Tracking number: ${trackingNumber}`);

// 5. Order Status Update
console.log("\n5. Updating the order status.");
order.updateStatus('shipped'); // Non-trivial method call
console.log(`New order status: ${order.getStatus()}`);

// test-scenario.js (Final section)

import { Flower, Bouquet } from './data/products.js';
import { Graph } from './utils/graph.js'; // Import Graph class

// --- Scenario: Graph-based Bouquet Optimization ---
console.log("\n--- Scenario: Graph-based Bouquet Optimization (MST) ---");

// 1. Create a bouquet with specific flowers
const redRose = new Flower(1, "Rose (Red)", 60, "img_path", "Red", 50);
const pinkGerbera = new Flower(6, "Gerbera (Pink)", 40, "img_path", "Pink", 45);
const silkRibbon = new Flower(200, "Ribbon", 25, "img_path", "paper", 0); // Treating decor as a simple item for this context

const customBouquet = new Bouquet(500, "Custom Optimization Test", 100, "img_path", []);
customBouquet.addFlower(redRose);
customBouquet.addFlower(pinkGerbera);
customBouquet.addFlower(silkRibbon);

console.log(`1. Bouquet created with ${customBouquet.getDescription()}`);

// 2. Build the full compatibility graph (This is a complex data structure for all flowers)
const fullCompatibilityGraph = new Graph();
fullCompatibilityGraph.addVertex('Rose (Red)');
fullCompatibilityGraph.addVertex('Gerbera (Pink)');
fullCompatibilityGraph.addVertex('Ribbon');

// Define connection costs: lower cost = more optimal connection for MST
fullCompatibilityGraph.addEdge('Rose (Red)', 'Ribbon', 2); // Very compatible
fullCompatibilityGraph.addEdge('Rose (Red)', 'Gerbera (Pink)', 10); // Less compatible
fullCompatibilityGraph.addEdge('Gerbera (Pink)', 'Ribbon', 5); // Decently compatible

console.log("2. Full Compatibility Graph created.");

// 3. Find the Minimum Spanning Tree (MST) for the specific bouquet items
// This is used to find the minimum 'cost' of connections (e.g., resources, time) to hold the bouquet together

console.log("3. Calculating Optimal Connection Costs (MST):");

// Algorithm 1: Kruskal's
const kruskalResult = customBouquet.findOptimalFlowerConnections(fullCompatibilityGraph, 'Kruskal');
console.log(`   -> Kruskal's (Optimal Connections): Cost ${kruskalResult.weight}. Algorithm: ${kruskalResult.algorithm}`);
// Expected MST edges: Rose-Ribbon (2), Gerbera-Ribbon (5). Total cost: 7.

// Algorithm 2: Prim's
const primResult = customBouquet.findOptimalFlowerConnections(fullCompatibilityGraph, 'Prim');
console.log(`   -> Prim's (Optimal Connections): Cost ${primResult.weight}. Algorithm: ${primResult.algorithm}`);
// Expected MST edges: Same as Kruskal's, Total cost: 7.

console.log("\nConclusion: The optimal connection cost (MST) for this bouquet is 7, using two connecting elements.");