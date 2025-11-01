// backend/server.js

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

import { products, Bouquet, Flower, DecorItem } from './data/products/products.js';
import { User } from './data/entities/User.js';
import { Order } from './data/entities/Order.js';
import { Payment } from './data/entities/Payment.js';
import { NovaPoshtaShipping } from './data/entities/Shipping.js';
import { compatibilityGraph } from './utils/compatibilityGraph.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(projectRoot, 'frontend')));
app.use('/images', express.static(path.join(projectRoot, 'images')));
app.use('/entities', express.static(path.join(projectRoot, 'backend/data/entities')));

// === "Hydration" Helper Function ===
function hydrateProduct(product) {
    const data = {
        id: product.getId(),
        name: product.getName(),
        price: product.getPrice(),
        image: product.getImage(),
        description: product.getDescription(),
        isPricy: product.isPricy(),
        type: 'ShopItem'
    };

    if (typeof product.isSuitableForTallVase === 'function') {
        data.type = 'Flower';
        data.isSuitableForTallVase = product.isSuitableForTallVase();
    } else if (typeof product.addFlower === 'function') {
        data.type = 'Bouquet';
        data.mainColor = product.getMainColor();
        data.season = product.getSeason();
    } else if (product.constructor.name === 'DecorItem') {
        data.type = 'DecorItem';
    }
    
    return data;
}
// === END OF FUNCTION ===


// === API Endpoints ===

app.get('/api/products', (req, res) => {
    const hydratedProducts = products.map(hydrateProduct); 
    res.json(hydratedProducts);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.getId() === id);
    if (product) {
        res.json(hydrateProduct(product)); 
    } else {
        res.status(404).json({ error: 'Product not found' }); // (TRANSLATED)
    }
});

app.get('/api/components', (req, res) => {
    const flowers = products.filter(p => {
        return typeof p.isSuitableForTallVase === 'function';
    });
    const hydratedFlowers = flowers.map(hydrateProduct); 
    res.json(hydratedFlowers);
});

app.post('/api/order', (req, res) => {
    const orderData = req.body;
    try {
        if (!orderData || !orderData.items || !orderData.user) {
            return res.status(400).json({ error: 'Empty or incorrect order data' }); // (TRANSLATED)
        }
        const user = new User(Date.now(), orderData.user.name, orderData.user.email);
        const addressSet = user.setShippingAddress(orderData.user.address);
        if (!addressSet) { throw new Error('Address must be longer than 5 characters.'); } // (TRANSLATED)
        
        const order = new Order(Date.now() + 1, user);
        orderData.items.forEach(item => order.addItem(item));
        const orderTotal = order.calculateTotal();
        
        const shipping = new NovaPoshtaShipping(1, user.getShippingAddress(), 1);
        const shippingCost = shipping.calculateCost();
        const finalTotal = orderTotal + shippingCost;
        
        const payment = new Payment(Date.now() + 2, finalTotal, orderData.paymentMethod);
        payment.processPayment();
        const trackingNumber = shipping.generateTrackingNumber();

        res.status(201).json({
            success: true,
            message: 'Order processed successfully!', // (TRANSLATED)
            orderId: order.getOrderId(),
            customerName: user.getName(),
            welcomeMessage: user.generateWelcomeMessage(),
            totalPaid: finalTotal,
            shippingCost: shippingCost,
            trackingNumber: trackingNumber,
            status: order.getStatus()
        });
    } catch (error) {
        console.error('Order processing failed:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

app.post('/api/build-bouquet', (req, res) => {
     const { componentNames } = req.body;
     if (!componentNames || componentNames.length < 2) {
        return res.status(400).json({ success: false, error: 'Bouquet must have at least 2 components.' }); // (TRANSLATED)
     }
     try {
        const components = products.filter(p => componentNames.includes(p.getName()));
        const tempBouquet = new Bouquet(999, 'Temp Builder', 0, '', components);
        const result = tempBouquet.findOptimalFlowerConnections(compatibilityGraph, 'Kruskal');
        
        res.status(200).json({
            success: true,
            assemblyCost: result.weight,
            connections: result.mst.length,
            algorithm: result.algorithm
        });
     } catch (error) {
        console.error('Bouquet build error:', error.message);
        res.status(500).json({ success: false, error: 'Error processing bouquet logic.' }); // (TRANSLATED)
     }
});

// --- Catch-all for HTML5 routing ---
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'index.html'));
});
app.get('/cart.html', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'cart.html'));
});
app.get('/details.html', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'details.html'));
});
app.get('/checkout.html', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'checkout.html'));
});
app.get('/builder.html', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'builder.html'));
});
app.get('/products.html', (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'products.html'));
});

app.listen(PORT, () => {
    console.log(`Server running. Frontend accessible at http://localhost:${PORT}`);
});