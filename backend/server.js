// backend/server.js

import express from 'express';
import cors from 'cors';

// Import the raw product array AND the Bouquet class
import { products, Bouquet } from './data/products/products.js';

// Import all Business Logic Classes
import { User } from './data/entities/User.js';
import { Order } from './data/entities/Order.js';
import { Payment } from './data/entities/Payment.js';
import { NovaPoshtaShipping } from './data/entities/Shipping.js';
import { compatibilityGraph } from './utils/compatibilityGraph.js'; // Needed if builder exists

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// === API Endpoints for Products ===

// GET /products
app.get('/products', (req, res) => {
    // Sends the raw array of product CLASS INSTANCES
    res.json(products);
});

// GET /products/:id
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.getId() === id);
    if (product) {
        res.json(product); // Send the single CLASS INSTANCE
    } else {
        res.status(404).json({ error: 'Товар не знайдено' });
    }
});

// === API Endpoint for Orders ===
app.post('/order', (req, res) => {
    const orderData = req.body;
    try {
        if (!orderData || !orderData.items || orderData.items.length === 0 || !orderData.user) {
            return res.status(400).json({ error: 'Порожні або некоректні дані замовлення' });
        }
        const user = new User(Date.now(), orderData.user.name, orderData.user.email);
        const addressSet = user.setShippingAddress(orderData.user.address);
        if (!addressSet) { throw new Error('Адреса має бути довшою за 5 символів.'); }
        const order = new Order(Date.now() + 1, user);
        orderData.items.forEach(item => order.addItem(item));
        const orderTotal = order.calculateTotal();
        const shipping = new NovaPoshtaShipping(1, user.getShippingAddress(), 1);
        const shippingCost = shipping.calculateCost();
        const finalTotal = orderTotal + shippingCost;
        const payment = new Payment(Date.now() + 2, finalTotal, orderData.paymentMethod);
        payment.processPayment();
        const trackingNumber = shipping.generateTrackingNumber();

        // --- NEW: Use generateWelcomeMessage() ---
        const welcomeMsg = user.generateWelcomeMessage(); // Call the method

        res.status(201).json({
            success: true, message: 'Замовлення успішно оброблено!',
            orderId: order.getOrderId(),
            customerName: user.getName(), // Keep this for reference
            welcomeMessage: welcomeMsg, // Add the personalized message
            totalPaid: finalTotal, shippingCost: shippingCost,
            trackingNumber: trackingNumber, status: order.getStatus()
        });
    } catch (error) {
        console.error('Order processing failed:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

// === API Endpoint for Bouquet Builder ===
// Keep this even if the frontend isn't fully implemented yet
app.post('/build-bouquet', (req, res) => {
    const { componentNames } = req.body;
    if (!componentNames || componentNames.length < 2) {
        return res.status(400).json({ success: false, error: 'Букет повинен мати принаймні 2 компоненти для розрахунку.' });
    }
    try {
        const components = products.filter(p => componentNames.includes(p.getName()));
        const tempBouquet = new Bouquet(999, 'Temp Builder', 0, '', components);
        const result = tempBouquet.findOptimalFlowerConnections(compatibilityGraph, 'Kruskal');
        res.status(200).json({ success: true, assemblyCost: result.weight, connections: result.mst.length, algorithm: result.algorithm });
    } catch (error) {
        console.error('Bouquet build error:', error.message);
        res.status(500).json({ success: false, error: 'Помилка під час обробки логіки букета.' });
    }
});


app.listen(PORT, () => {
    console.log(`Flower shop backend running on http://localhost:${PORT}`);
});