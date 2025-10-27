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
    // --- 1. ROSES ---
    new Flower(1, "Rose (Red)", 60, "/images/roses/rose_red.jpg", "Red", 50),
    new Flower(2, "Rose (White)", 55, "/images/roses/rose_white.jpg", "White", 45),
    new Flower(3, "Rose (Pink)", 58, "/images/roses/rose_pink.jpg", "Pink", 55),
    new Flower(4, "Rose (Cream)", 62, "/images/roses/rose_cream.jpg", "Cream", 50),
    new Flower(5, "Bush Rose (Pink-White)", 45, "/images/roses/rose_bush_pb.jpg", "Pink-White", 30),
    
    // --- 2. GERBERAS ---
    new Flower(6, "Gerbera (Pink)", 40, "/images/gerbera/gerbera_pink.jpg", "Pink", 45),
    new Flower(7, "Gerbera (Yellow)", 42, "/images/gerbera/gerbera_yellow.jpg", "Yellow", 40),
    new Flower(8, "Gerbera (Orange)", 43, "/images/gerbera/gerbera_orange.jpg", "Orange", 50),

    // --- 3. DAISIES & DIANTHUS ---
    new Flower(9, "Daisy (Field)", 25, "/images/other/daisy_field.jpg", "White", 30),
    new Flower(13, "Dianthus (Pink)", 30, "/images/dianthus/dianthus_pink.jpg", "Pink", 35),
    new Flower(14, "Dianthus (White)", 32, "/images/dianthus/dianthus_white.jpg", "White", 30),

    // --- 4. HYDRANGEAS (Expensive items) ---
    new Flower(10, "Hydrangea (Pink)", 120, "/images/hydrangea/hydrangea_pink.jpg", "Pink", 60),
    new Flower(11, "Hydrangea (Blue)", 130, "/images/hydrangea/hydrangea_blue.jpg", "Blue", 65),
    new Flower(12, "Hydrangea (White)", 125, "/images/hydrangea/hydrangea_white.jpg", "White", 55),

    // --- 5. CHRYSANTHEMUMS ---
    new Flower(15, "Chrysanthemum (White)", 48, "/images/chrysanthemum/chrysanthemum_white.jpg", "White", 50),
    new Flower(16, "Chrysanthemum (Pink)", 49, "/images/chrysanthemum/chrysanthemum_pink.jpg", "Pink", 55),
    new Flower(17, "Chrysanthemum (Yellow)", 50, "/images/chrysanthemum/chrysanthemum_yellow.jpg", "Yellow", 50), 
    
    // --- 6. TULIPS (Added types) ---
    new Flower(18, "Tulip (Yellow)", 35, "/images/other/tulip_yellow.jpg", "Yellow", 30), 
    new Flower(19, "Tulip (Purple)", 38, "/images/other/tulip_purple.jpg", "Purple", 35), 

    // --- 7. Bouquets and Decor ---
    new Bouquet(100, "Bouquet 'Tenderness'", 350, "/images/bouquets/bouquet_tenderness.jpg", []), 
    new Bouquet(101, "Bouquet 'Premium'", 500, "/images/bouquets/bouquet_premium.jpg", []), 
    // This is the new item you added - it's correct
    new SpecialBouquet(102, "Wedding Bouquet", 1200, "/images/bouquets/bouquet_premium.jpg", [], 'Wedding'),
    new DecorItem(200, "Silk Ribbon", 25, "/images/decor/ribbon_silk.jpg", "paper"),
    new DecorItem(201, "Vase (Small)", 150, "/images/decor/vase_small.jpg", "glass"), 
    new DecorItem(202, "Greeting Card", 15, "/images/decor/card.jpg", "paper"), 
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