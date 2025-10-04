import express from 'express';
import cors from 'cors';
import { products } from './data/products.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Route for retrieving all products ---
app.get('/products', (req, res) => {
    res.json(products);
});

// --- Route for placing an order ---
app.post('/order', (req, res) => {
    const order = req.body;
    if (!order || !order.items || order.items.length === 0) {
        return res.status(400).json({ error: 'Порожнє замовлення' });
    }
    res.json({ success: true, message: 'Замовлення прийнято!', order });
});

app.listen(PORT, () => {
    console.log(`Flower shop backend running on http://localhost:${PORT}`);
});