//(Module Aggregator)

// Import all entities from their respective individual files
import { User } from './User.js';
import { Order } from './Order.js';
import { Payment } from './Payment.js';
import { Shipping, NovaPoshtaShipping } from './Shipping.js';

// Aggregate and export all entities together
// This allows other files (e.g., test-scenario.js or other modules)
// to import everything with a single, clean statement: 
// import { User, Order } from './backend/data/entities.js';
export {
    User,
    Order,
    Payment,
    Shipping,
    NovaPoshtaShipping
};