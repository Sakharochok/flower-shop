import express from 'express';
import cors from 'cors';

// --- Product Data Imports ---
import { products } from './data/products/products.js';

// Import ALL Business Logic Classes ---
import { User } from './data/entities/User.js';
import { Order } from './data/entities/Order.js';
import { Payment } from './data/entities/Payment.js';
import { NovaPoshtaShipping } from './data/entities/Shipping.js';


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// === API Endpoints for Products ===

// GET /products (Get all products)
app.get('/products', (req, res) => {
    res.json(products);
});

// GET /products/:id (Get a single product by ID)
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.getId() === id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

// === API Endpoint for Orders ===

// --- REWRITTEN (Phase 2): Process a new order ---
app.post('/order', (req, res) => {
    const orderData = req.body;

    try {
        // 1. Basic validation
        if (!orderData || !orderData.items || orderData.items.length === 0 || !orderData.user) {
            return res.status(400).json({ error: 'Empty or invalid order data' });
        }

        // 2. --- Use User Class (from backend/data/entities) ---
        // The server, not the client, creates the class instance
        const user = new User(Date.now(), orderData.user.name, orderData.user.email);
        
        // Use the non-trivial validation method
        const addressSet = user.setShippingAddress(orderData.user.address);

        if (!addressSet) {
            // Throw an error that the client will receive
            throw new Error('Address must be longer than 5 characters.');
        }

        // 3. --- Use Order Class ---
        const order = new Order(Date.now() + 1, user); 
        orderData.items.forEach(item => {
            // Note: In a real app, we'd verify price and ID here
            order.addItem(item);
        });

        // Use the non-trivial calculation method
        const orderTotal = order.calculateTotal();

        // 4. --- Use Shipping Class (Previously Unused) ---
        const shipping = new NovaPoshtaShipping(1, user.getShippingAddress(), 1); // Use Warehouse 1 as default
        
        // Use the non-trivial .calculateCost() method
        const shippingCost = shipping.calculateCost();
        
        const finalTotal = orderTotal + shippingCost;

        // 5. --- Use Payment Class ---
        const payment = new Payment(Date.now() + 2, finalTotal, orderData.paymentMethod);
        
        // Use the non-trivial .processPayment() method
        payment.processPayment();

        // 6. --- Use another Unused Shipping Method ---
        const trackingNumber = shipping.generateTrackingNumber();

        // 7. --- Send a rich, successful response back to the client ---
        res.status(201).json({ 
            success: true, 
            message: 'Order processed successfully!', 
            orderId: order.getOrderId(),
            customerName: user.getName(), // Using .getName()
            totalPaid: finalTotal,
            shippingCost: shippingCost,
            trackingNumber: trackingNumber,
            status: order.getStatus() // Using .getStatus()
        });

    } catch (error) {
        // This will catch errors (like the address validation)
        // and send them to the client
        console.error('Order processing failed:', error.message);
        res.status(400).json({ 
            success: false,
            error: error.message 
        });
    }
});
// --- End of rewritten route ---

app.listen(PORT, () => {
    console.log(`Flower shop backend running on http://localhost:${PORT}`);
});