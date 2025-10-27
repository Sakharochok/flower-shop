# Flower Shop
Simple flower shop project — frontend + backend (Node.js).

This is an educational project that simulates the functionality of an online flower shop. It consists of a user-facing frontend and a logic-processing backend.

The project was developed as part of the "Object-Oriented Programming Fundamentals" course and serves as a practical demonstration of key OOP principles, including encapsulation, inheritance, polymorphism, and abstraction.


  Key Features
Product Catalog: View an assortment of flowers, bouquets, and decor items.

Shopping Cart: Add products to the cart and view the total quantity and price.

Object-Oriented Model: The backend is built on a clear class system representing entities (User, Order) and products (Flower, Bouquet).

Algorithmic Logic: Implements a graph-based algorithm (Minimum Spanning Tree) to find optimal flower combinations within a bouquet.

Unit Tests: Includes a suite of tests to verify the correct functionality of key classes and methods.


  OOP Requirements Compliance Report
This project fully meets the requirements of the OOP course. Below is a detailed breakdown.

Implemented Classes (14 Total)
Product Classes: ShopItem, Flower, Bouquet, SpecialBouquet, DecorItem. These classes model the items sold in the shop.

Entity Classes: User, Order, Payment, Shipping, NovaPoshtaShipping. These classes represent business-level entities.

Utility/Infrastructure Classes: Store, Cart, Graph, DSU. These classes provide supporting functionality for storage, cart management, and algorithms.

Encapsulation
Encapsulation is fully implemented across the entire project. All class fields are declared as private using the # prefix (e.g., #id, #name, #price). This prevents direct external access and modification of an object's internal state. Data is only exposed and modified through public methods (getters and non-trivial methods), ensuring data integrity and hiding implementation details.

Inheritance Hierarchies (2 Total)
The project features two distinct inheritance chains, including one with three levels.

Three-Level Product Hierarchy: This chain demonstrates deep inheritance where specialized classes extend and override functionality.

ShopItem (Base class for all products)

Bouquet (Inherits from ShopItem)

SpecialBouquet (Inherits from Bouquet, adding specialized logic for themed bouquets)

Shipping Hierarchy: This chain demonstrates abstraction, where a base class defines a contract for concrete implementations.

Shipping (Abstract base class defining the interface for shipping methods)

NovaPoshtaShipping (A concrete implementation of a shipping method)

Polymorphism (3+ Independent Cases)
The project demonstrates both dynamic and static polymorphism.

Dynamic Polymorphism (via getDescription method): The base ShopItem class defines a virtual getDescription() method. This method is overridden in every descendant (Flower, DecorItem, Bouquet, SpecialBouquet) to provide a unique, type-specific description. This allows client code to call item.getDescription() on any product and get the correct description at runtime without knowing the object's concrete type.

Dynamic Polymorphism (via calculateCost method): The abstract Shipping class declares a calculateCost() method that must be implemented by its subclasses. The NovaPoshtaShipping class provides a concrete implementation. This allows the system to calculate shipping costs for different carriers through a common interface.

Static Polymorphism (Generics/Type Checking): The Store.addItem(item) method enforces a type constraint. It uses an instanceof ShopItem check to ensure that only objects belonging to the ShopItem inheritance tree can be added to the store. Attempting to add an incompatible object (e.g., a User) throws a runtime error, simulating generic type safety.



List of Non-Trivial Methods (30+ Total)
This is a comprehensive list of methods with logic beyond simple field assignment or retrieval.

ShopItem.isPricy(): Checks if the item's price exceeds a predefined threshold.

Flower.isSuitableForTallVase(): Returns true if the flower's stem is long enough for a tall vase.

Bouquet.addFlower(): Adds a Flower object to the bouquet's internal collection.

Bouquet.findOptimalFlowerConnections(): Applies graph theory (MST) to a provided compatibility graph to determine the most efficient way to assemble the bouquet components.

SpecialBouquet.getOccasion(): Returns the specific occasion (e.g., 'Wedding') for the themed bouquet.

Store.addItem(): Adds an item to the store collection after verifying its type is ShopItem.

Store.getTotalItemsCount(): Returns the total number of items currently in the store.

Store.clearItems(): Empties the store's item collection.

Store.getItemById(): Searches for and returns an item from the store by its unique ID.

User.setShippingAddress(): Sets the user's address after validating that it meets a minimum length requirement.

User.generateWelcomeMessage(): Creates a personalized welcome string for the user.

Order.addItem(): Adds a product line item to the order.

Order.calculateTotal(): Computes the total cost of all items in the order, considering quantities.

Order.updateStatus(): Changes the order's status after validating it against a list of permissible values.

Payment.processPayment(): Simulates a payment transaction and updates the isPaid status.

Payment.isCardPayment(): Checks if the payment was made by card.

Shipping.generateTrackingNumber(): Generates a unique, random tracking number for a shipment.

NovaPoshtaShipping.calculateCost(): Returns the fixed shipping cost for this specific carrier.

Cart.saveCart(): Serializes the cart's contents and saves them to the browser's localStorage.

Cart.addItem(): Adds a product to the cart, incrementing the quantity if the item already exists.

Cart.getTotalItemsCount(): Calculates the sum of quantities of all items in the cart.

Cart.getTotalPrice(): Calculates the total price of all items, factoring in their quantities.

Cart.removeItem(): Removes an entire product line from the cart using its ID.

DSU.find(): Implements the find operation for a Disjoint Set Union data structure with path compression.

DSU.union(): Implements the union operation to merge two sets in a DSU structure.

Graph.addVertex(): Adds a new vertex to the graph's adjacency list.

Graph.addEdge(): Adds a weighted, undirected edge between two existing vertices.

Graph.removeEdge(): Removes an edge between two vertices from the graph.

Graph.kruskalMST(): Implements Kruskal's algorithm to find the Minimum Spanning Tree of the graph.

Graph.primMST(): Implements Prim's algorithm to find the Minimum Spanning Tree of the graph.
