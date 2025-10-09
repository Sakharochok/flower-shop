
// Unit test scenario to confirm the functionality of OOP classes.

// Import classes via the aggregators (products.js and entities.js)
import { Flower, Bouquet, DecorItem, Store, ShopItem } from '../backend/data/products/products.js';
import { User, Order, Payment, NovaPoshtaShipping } from '../backend/data/entities/entities.js';

// Helper function for test result output
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAILED: ${message}`);
        return false;
    }
    console.log(`✅ PASSED: ${message}`);
    return true;
}

// =========================================================================
// TEST SCENARIOS
// =========================================================================

// --- 1. TEST: DYNAMIC POLYMORPHISM AND INHERITANCE ---
function testDynamicPolymorphism() {
    console.log("\n--- Test 1: Dynamic Polymorphism (getDescription) ---");
    
    const rose = new Flower(1, "Rose", 60, "img.jpg", "Red", 50);
    const ribbon = new DecorItem(200, "Silk Ribbon", 25, "img.jpg", "paper");

    // 1. Check overridden method for Flower
    assert(rose.getDescription().includes("Color: Red") && rose.getDescription().includes("50 cm"), 
           "Flower: getDescription() returns correct description.");

    // 2. Check overridden method for DecorItem
    assert(ribbon.getDescription().includes("made of paper"), 
           "DecorItem: getDescription() returns material description.");

    // 3. Check non-trivial inherited method (isPricy)
    assert(rose.isPricy() === false, "ShopItem: isPricy() works correctly (false).");
    const hydrangea = new Flower(10, "Hydrangea", 120, "img.jpg", "Blue", 60);
    assert(hydrangea.isPricy() === true, "ShopItem: isPricy() works correctly (true).");
}

// --- 2. TEST: STATIC POLYMORPHISM (Type Constraints/Generics) ---
function testStaticPolymorphism() {
    console.log("\n--- Test 2: Static Polymorphism (Store.addItem) ---");
    const store = new Store();
    const item = new DecorItem(200, "Ribbon", 25, "img.jpg", "paper");
    const user = new User(1, "Alice", "a@mail.com"); // Object from a different hierarchy

    // 1. Adding an allowed type (ShopItem descendant)
    store.addItem(item);
    assert(store.getTotalItemsCount() === 1, "Store: Added allowed type (DecorItem).");

    // 2. Check type constraint: attempting to add a forbidden type
    try {
        store.addItem(user); 
        assert(false, "Store: Forbidden type (User) DID NOT throw an error.");
    } catch (e) {
        // Expecting the code to throw an error containing the type constraint message
        assert(e.message === "Element must inherit from ShopItem.", 
               "Store: Forbidden type THREW the correct error (Static Polymorphism).");
    }
}


// --- 3. TEST: NON-TRIVIAL METHODS and Abstraction ---
function testNontrivialMethodsAndAbstraction() {
    console.log("\n--- Test 3: Non-Trivial Methods and Abstraction ---");
    
    // 3A. Test Non-Trivial method Order.calculateTotal (calculation)
    const testUser = new User(2, "Bob", "b@mail.com");
    const order = new Order(1001, testUser);
    
    order.addItem({ price: 100, quantity: 2 }); 
    order.addItem({ price: 50, quantity: 1 });  
    assert(order.calculateTotal() === 250, "Order: calculateTotal() calculates the correct total.");

    // 3B. Test Non-Trivial method User.setShippingAddress (with validation)
    assert(testUser.setShippingAddress("Kyiv, Main Street 10") === true, 
           "User: setShippingAddress() (with validation) successfully sets address.");
    assert(testUser.setShippingAddress("K 1") === false, 
           "User: setShippingAddress() (with validation) rejects short address.");
           
    // 3C. Test Abstraction (calculateCost)
    const novaPoshta = new NovaPoshtaShipping(1, "Kyiv", "NP-101");
    assert(novaPoshta.calculateCost() === 80, 
           "NovaPoshtaShipping: calculateCost() (Abstraction Polymorphism) returns correct cost.");

    // 3D. Test Non-Trivial method Payment.processPayment
    try {
        new Payment(1, 100, 'card').processPayment();
        assert(true, "Payment: processPayment() successfully processes payment.");
    } catch (e) {
        assert(false, "Payment: processPayment() should not throw an error.");
    }
}


// =========================================================================
// RUN ALL TESTS
// =========================================================================

testDynamicPolymorphism();
testStaticPolymorphism();
testNontrivialMethodsAndAbstraction();