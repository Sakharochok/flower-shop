// backend/data/products/products.js

/**
 * Module aggregator for all shop products and product-related classes.
 * Contains the main array of all available products.
 * @module products
 */
import { ShopItem } from './ShopItem.js';
import { Flower } from './Flower.js';
import { Bouquet } from './Bouquet.js';
import { DecorItem } from './DecorItem.js';
import { Store } from './Store.js'; 
import { SpecialBouquet } from './SpecialBouquet.js';

// =========================================================================
// PRODUCTS ARRAY
// =========================================================================

/**
 * Array of all available products in the shop.
 * Contains instances of Flower, Bouquet, DecorItem, etc.
 * @type {Array<ShopItem>}
 */
const products = [
    
    // === 1. BUILDER COMPONENTS (SINGLE FLOWERS with .png) ===
    // (These are identified by 'isSuitableForTallVase' method)
    
    new Flower(1, "Pink Rose (builder)", 60, "/images/1pinkRose.png", "Pink", 50),
    new Flower(2, "Red Rose (builder)", 65, "/images/1redRose.png", "Red", 55),
    new Flower(3, "White Rose (builder)", 55, "/images/1whiteRose.png", "White", 50),
    new Flower(10, "Pink Tulip (builder)", 40, "/images/1pinkTulip.png", "Pink", 40),
    new Flower(11, "Red Tulip (builder)", 45, "/images/1redTulip.png", "Red", 45),
    new Flower(12, "White Tulip (builder)", 38, "/images/1whiteTulip.png", "White", 40),
    new Flower(20, "Pink Lily (builder)", 70, "/images/1pinkLily.png", "Pink", 60),
    new Flower(21, "White Lily (builder)", 65, "/images/1whiteLily.png", "White", 60),
    new Flower(30, "Pink Gerbera (builder)", 50, "/images/1pinkGerbera.png", "Pink", 45),
    new Flower(40, "Sunflower (builder)", 55, "/images/1sunflower.png", "Yellow", 50),

    // === 2. BOUQUETS (MAIN PAGE with .jpg) ===
    // (These are identified as 'Bouquet' class)
    // constructor(id, name, price, image, flowers, mainColor, season)
    
    // Original Bouquets
    new Bouquet(100, "101 Roses", 5500, "/images/100&1roses.jpg", [], 'Pink', 'All-Year'),
    new Bouquet(101, "Bouquet of Gerberas", 750, "/images/bouquetOfGerberas.jpg", [], 'Pink', 'Summer'),
    new Bouquet(102, "Bouquet of Lilies", 800, "/images/bouquetOfLilies.jpg", [], 'Pink', 'Summer'),
    new Bouquet(103, "Bouquet of Peonies", 1200, "/images/bouquetOfPeonies.jpg", [], 'Pink', 'Spring'),
    new Bouquet(104, "Spring Bouquet", 950, "/images/springBouquet.jpg", [], 'Mixed', 'Spring'),

    // New Bouquets from your screenshot
    new Bouquet(105, "Pink Rose Bouquet", 900, "/images/pinkRose.jpg", [], 'Pink', 'All-Year'),
    new Bouquet(106, "Red Rose Bouquet", 950, "/images/redRose.jpg", [], 'Red', 'All-Year'),
    new Bouquet(107, "White Rose Bouquet", 850, "/images/whiteRose.jpg", [], 'White', 'All-Year'),
    new Bouquet(108, "Pink Tulip Bouquet", 700, "/images/pinkTulip.jpg", [], 'Pink', 'Spring'),
    new Bouquet(109, "Red Tulip Bouquet", 750, "/images/redTulip.jpg", [], 'Red', 'Spring'),
    new Bouquet(110, "White Tulip Bouquet", 650, "/images/whiteTulip.jpg", [], 'White', 'Spring'),
    new Bouquet(111, "Pink Lily Bouquet", 1000, "/images/pinkLily.jpg", [], 'Pink', 'Summer'),
    new Bouquet(112, "White Lily Bouquet", 980, "/images/whiteLily.jpg", [], 'White', 'Summer'),
    new Bouquet(113, "Pink Gerbera Bouquet", 600, "/images/pinkGerbera.jpg", [], 'Pink', 'Summer'),
    new Bouquet(114, "Orange Gerbera Bouquet", 620, "/images/orangeGerbera.jpg", [], 'Orange', 'Summer'),
    new Bouquet(115, "Sunflower Bouquet", 780, "/images/sunflower.jpg", [], 'Orange', 'Autumn')
];

// --- AGGREGATED EXPORT ---
export { 
    products, 
    ShopItem, 
    Flower, 
    Bouquet, 
    DecorItem, 
    Store,
    SpecialBouquet 
};