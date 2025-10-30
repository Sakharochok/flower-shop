// backend/data/products/products.js

import { ShopItem } from './ShopItem.js';
import { Flower } from './Flower.js';
// Corrected case: 'Bouquet.js'
import { Bouquet } from './Bouquet.js';
// Corrected case: 'DecorItem.js'
import { DecorItem } from './DecorItem.js';
import { Store } from './Store.js'; 
import { SpecialBouquet } from './SpecialBouquet.js';

// =========================================================================
// PRODUCTS ARRAY (Full list of products for display)
// =========================================================================

const products = [
    
    // --- 1. Roses (from new images) ---
    new Flower(1, "Pink Rose", 60, "/images/pinkRose.jpg", "Pink", 50),
    new Flower(2, "Red Rose", 65, "/images/redRose.jpg", "Red", 55),
    new Flower(3, "White Rose", 55, "/images/whiteRose.jpg", "White", 50),

    // --- 2. Tulips (from new images) ---
    new Flower(10, "Pink Tulip", 40, "/images/pinkTulip.jpg", "Pink", 40),
    new Flower(11, "Red Tulip", 45, "/images/redTulip.jpg", "Red", 45),
    new Flower(12, "White Tulip", 38, "/images/whiteTulip.jpg", "White", 40),

    // --- 3. Lilies (from new images) ---
    new Flower(20, "Pink Lily", 70, "/images/pinkLily.jpg", "Pink", 60),
    new Flower(21, "White Lily", 65, "/images/whiteLily.jpg", "White", 60),

    // --- 4. Gerberas (from new images) ---
    new Flower(30, "Pink Gerbera", 50, "/images/pinkGerbera.jpg", "Pink", 45),
    new Flower(31, "Orange Gerbera", 52, "/images/orangeGerbera.jpg", "Orange", 45),

    // --- 5. Sunflowers (from new images) ---
    new Flower(40, "Sunflower", 55, "/images/sunflower.jpg", "Yellow", 50),

    // --- 6. Bouquets (from new images) ---
    // IDs for bouquets start at 100
    new Bouquet(100, "101 Roses", 5500, "/images/100&1roses.jpg", []),
    new Bouquet(101, "Bouquet of Gerberas", 750, "/images/bouquetOfGerberas.jpg", []),
    new Bouquet(102, "Bouquet of Lilies", 800, "/images/bouquetOfLilies.jpg", []),
    new Bouquet(103, "Bouquet of Peonies", 1200, "/images/bouquetOfPeonies.jpg", []),
    new Bouquet(104, "Spring Bouquet", 950, "/images/springBouquet.jpg", []),
];

// --- AGGREGATED EXPORT ---
// Makes all classes and the array available to other modules
export { 
    products, 
    ShopItem, 
    Flower, 
    Bouquet, 
    DecorItem, 
    Store,
    SpecialBouquet 
};