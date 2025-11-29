/**
 * Main Express server application file.
 * Handles API endpoints, static file serving, and core business logic execution.
 * @module server
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import validator from 'validator'; // [NEW] External library for robust validation

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Import data and utility classes
import { products, Bouquet } from './data/products/products.js';
import { User } from './data/entities/User.js';
import { Order } from './data/entities/Order.js';
import { Payment } from './data/entities/Payment.js';
import { NovaPoshtaShipping } from './data/entities/Shipping.js';
import { createMasterGraph } from './utils/compatibilityGraph.js';

const compatibilityGraph = createMasterGraph(products);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(projectRoot, 'frontend')));
app.use('/images', express.static(path.join(projectRoot, 'images')));
app.use('/entities', express.static(path.join(projectRoot, 'backend/data/entities')));

/**
 * Helper function to transform complex product objects (class instances) 
 * into simple Data Transfer Objects (DTOs) for API response.
 * @function
 * @param {Object} product - An instance of a product class (Flower, Bouquet, etc.).
 * @returns {Object} A simplified object containing key product data.
 */
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

// === CORE API ENDPOINTS ===

/**
 * GET /api/products
 * Returns a list of all products (hydrated DTOs).
 */
app.get('/api/products', (req, res) => {
    const hydratedProducts = products.map(hydrateProduct); 
    res.json(hydratedProducts);
});

/**
 * GET /api/products/:id
 * Returns a single product by ID.
 */
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.getId() === id);
    if (product) {
        res.json(hydrateProduct(product)); 
    } else {
        res.status(404).json({ error: 'Product not found' });
    }
});

/**
 * POST /api/order
 * Processes a new customer order. Implements robust validation using the 'validator' library.
 * @param {Object} req.body - Order details including user info, items, and payment method.
 */
app.post('/api/order', (req, res) => {
    const orderData = req.body;
    try {
        if (!orderData || !orderData.items || !orderData.user) {
            return res.status(400).json({ error: 'Empty or incorrect order data' });
        }
        
        // --- LAB 3: ROBUST INPUT VALIDATION (validator library) ---
        const { name, email, address } = orderData.user;
        
        if (!validator.isEmail(email)) {
            throw new Error('Invalid email format provided.');
        }

        const sanitizedName = validator.escape(name); // Prevents XSS injection on name
        
        // Basic address length check, now using sanitized name
        if (address.length < 5) {
             throw new Error('Address must be longer than 5 characters.');
        }

        // Use sanitized name for User creation
        const user = new User(Date.now(), sanitizedName, email);
        const addressSet = user.setShippingAddress(address);
        if (!addressSet) { throw new Error('Address setting failed.'); }

        const order = new Order(Date.now() + 1, user);
        orderData.items.forEach(item => order.addItem(item));
        const orderTotal = order.calculateTotal();
        
        const shipping = new NovaPoshtaShipping(1, user.getShippingAddress(), 1);
        const shippingCost = shipping.calculateCost();
        const finalTotal = orderTotal + shippingCost;
        
        const payment = new Payment(Date.now() + 2, finalTotal, orderData.paymentMethod);
        payment.processPayment();
        const trackingNumber = shipping.generateTrackingNumber();


        // (UPDATE) Send estimated delivery date to client
        res.status(201).json({
            success: true,
            message: 'Order processed successfully!',
            orderId: order.getOrderId(),
            customerName: user.getName(),
            totalPaid: finalTotal,
            trackingNumber: trackingNumber,
            estimatedDelivery: order.getEstimatedDeliveryDate() // <--- ОСЬ ЦЕ НОВЕ ПОЛЕ
        });
   
    } catch (error) {
        console.error('Order processing failed:', error.message);
        res.status(400).json({ success: false, error: error.message });
    }
});

/**
 * POST /api/build-bouquet
 * Calculates the optimal assembly cost using the MST graph algorithm.
 * @param {Array<string>} req.body.componentNames - Names of the flowers selected for the bouquet.
 */
app.post('/api/build-bouquet', (req, res) => {
     const { componentNames } = req.body;
     if (!componentNames || componentNames.length < 2) {
        return res.status(400).json({ success: false, error: 'Bouquet must have at least 2 components.' });
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
        res.status(500).json({ success: false, error: 'Error processing bouquet logic.' });
     }
});


// ... (Static routes for HTML5 navigation remain unchanged)
app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(projectRoot, 'frontend', 'index.html'));
});
// ... (other static routes: /cart.html, /details.html, /checkout.html, etc.)

app.listen(PORT, () => {
    console.log(`Server running. Frontend accessible at http://localhost:${PORT}`);
});