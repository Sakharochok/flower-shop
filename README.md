# 🌸 Flower Shop Project

**Flower Shop** is a full-stack web application for an online flower shop, developed as a capstone project for the "Basics of Object-Oriented Programming" course.

The project combines classic e-commerce functionality, strict object-oriented architecture, and the use of graph theory algorithms to calculate bouquet complexity.

---

## 📋 Table of Contents
1. [Lab 1: OOP Basics](#1-lab-1-oop-basics)
2. [Lab 1a: Refactoring & UML](#1a-lab-1a-refactoring--uml-modeling) 3. [Lab 2: Graphical User Interface (GUI)](#2-lab-2-graphical-user-interface-gui)
4. [Lab 3: External Libraries](#3-lab-3-external-libraries)
5. [Academic Project](#4-academic-project)
6. [Documentation](#5-documentation)
7. [Installation & Setup](#-installation--setup)
8. [Project Structure](#-project-structure)

---

## 1. Lab 1: OOP Basics
*Implementation of Encapsulation, Inheritance, and Polymorphism requirements.*

The project implements a strict OOP architecture:

* **Classes & Objects:** Over **12 classes** implemented (minimum requirement: 9).
    * *Entities:* `User`, `Order`, `Payment`, `Shipping`.
    * *Products:* `ShopItem`, `Flower`, `DecorItem`, `Bouquet`, `SpecialBouquet`.
    * *Utils:* `Graph`, `Store`.
* **Encapsulation:** All classes utilize private fields (`#price`, `#items`, `#status`). Access is controlled via getters and validation methods (e.g., `User.setShippingAddress` validates string length).
* **Inheritance (Hierarchies):**
    1.  `ShopItem` (Base) → `Flower`, `DecorItem`, `Bouquet`.
    2.  `Bouquet` → `SpecialBouquet` (Deep hierarchy, 3 levels).
    3.  `Shipping` (Abstract) → `NovaPoshtaShipping`.
* **Polymorphism:**
    * **Dynamic:** The `getDescription()` method is overridden in `Flower`, `DecorItem`, and `SpecialBouquet` classes.
    * **Static (Generics Simulation):** The `Store` class implements a container that accepts only objects inheriting from `ShopItem`.
* **Non-trivial Methods:** Over 25 complex methods implemented, including `findOptimalFlowerConnections` (graph algorithm), `processPayment`, and `updateStatus`.

---

## 1a. Lab 1a: Refactoring & UML Modeling
*Advanced system modeling and architectural improvements.*

**1. Refactoring (Strategy Pattern)**
* **Problem:** The `Order` class had high coupling with specific shipping logic (`NovaPoshtaShipping`), violating the Open/Closed Principle.
* **Solution:** Implemented the **Strategy Pattern**. Shipping logic was encapsulated into separate strategy classes (`NovaPoshtaStrategy`, `PickupStrategy`) implementing a common interface.
* **Result:** New delivery methods can be added without modifying the core `Order` logic.

**2. UML Modeling**
A complete set of **8 UML diagrams** was created to document the system:
* **Static Structure:** Class Diagram, Component Diagram, Deployment Diagram, Object Diagram.
* **Dynamic Behavior:** Use Case Diagram, Sequence Diagram, Activity Diagram, State Machine Diagram.

---

## 2. Lab 2: Graphical User Interface (GUI)
*Implementation of interactive user interaction.*

The interface is decoupled from business logic (Frontend in `frontend/`, Backend in `backend/`).

* **Screens (Forms/Windows):** **6 pages** implemented (minimum requirement: 4):
    1.  `index.html` (Home)
    2.  `products.html` (Catalog with filters)
    3.  `details.html` (Product Details)
    4.  `cart.html` (Shopping Cart)
    5.  `checkout.html` (Order Checkout)
    6.  `builder.html` (Bouquet Builder)
* **Controls:** Over **25 elements** used (minimum requirement: 20):
    * Filters: by color (radio buttons), seasonality (toggle), price (inputs), search (text input).
    * Drag-and-Drop zone for the builder.
    * Quantity controls (+/-), Add to Cart, Remove buttons.
* **Data Containers:** Dynamic population of product lists (`.product-list`), cart items, and builder components.
* **Event Handling:** Event listeners implemented for `click`, `input`, `submit`, `dragstart`, `drop`, `dragover`, `DOMContentLoaded`.

---

## 3. Lab 3: External Libraries
*Integration of third-party solutions to enhance code quality.*

A detailed retrospective report can be found here: [📄 LAB3_REPORT.md](./LAB3_REPORT.md)

**Libraries Used:**
1.  **`validator` (v13.12.0)**:
    * Used on the backend for input sanitization (XSS protection) and email validation during order processing.
2.  **`date-fns` (v4.1.0)**:
    * Used in the `Order` class for precise delivery date calculations (adding days, date formatting).

---

## 4. Academic Project
*Implementation of unique functionality and domain analysis.*

A detailed market and analog analysis can be found here: [📊 ANALYSIS.md](./ANALYSIS.md)

**Key Project Features:**
* **Bouquet Builder:** A unique feature distinguishing this project from typical flower shops. Users can custom-build a bouquet by dragging and dropping flowers (Drag & Drop).
* **Algorithmic Component (Graph Theory):**
    * Flowers are represented as **Graph Vertices**, and their compatibility as Edge Weights.
    * **Kruskal’s Algorithm (MST - Minimum Spanning Tree)** is used to calculate the optimal "Assembly Cost" based on the compatibility of selected components.
    * This solves the "Black Box Pricing" issue by transparently explaining the composition complexity to the user.

---

## 5. Documentation
Full technical documentation for the project's classes, methods, and modules has been generated using **JSDoc**.

It covers all backend entities, product classes, and utility functions.

🔗 **View Full Documentation:**
[**https://sakharochok.github.io/flower-shop/module-details.html**](https://sakharochok.github.io/flower-shop/module-details.html)

---

## 🚀 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/flower-shop.git](https://github.com/your-username/flower-shop.git)
    cd flower-shop
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the server:**
    ```bash
    node backend/server.js
    ```

4.  **Open in browser:**
    Navigate to `http://localhost:3001`

5.  **Run Tests:**
    ```bash
    node tests/oop-tests.js
    ```

---

## 📂 Project Structure

```text
FLOWER-SHOP
├── backend
│   ├── data
│   │   ├── entities   # User, Order, Payment, Shipping (Strategy)
│   │   ├── products   # ShopItem, Flower, Bouquet, SpecialBouquet
│   │   └── utils      # Graph Algorithms, Store
│   └── server.js      # Express Server & API Endpoints
├── frontend
│   ├── css            # Styles
│   ├── js             # Client logic (main.js, cart.js, builder.js)
│   └── *.html         # Pages
├── tests              # Unit Tests (OOP logic check)
├── docs               # Project Documentation
│   └── diagrams       # UML Diagrams (PlantUML/Images)
├── ANALYSIS.md        # Project & Analog Analysis
├── LAB3_REPORT.md     # External Libraries Report
└── README.md          # Project Documentation