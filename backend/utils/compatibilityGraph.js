// backend/utils/compatibilityGraph.js

import { Graph } from './graph.js';
// (FIX) Ми ПРИБРАЛИ звідси імпорт 'products'.

/**
 * (FIX) Створює та експортує граф сумісності
 * Тепер він ПРИЙМАЄ 'products' як аргумент.
 */
export function createMasterGraph(products) {
    const masterGraph = new Graph();

    // 1. Додаємо ВСІ продукти (включно з букетами) як вершини
    for (const product of products) {
        masterGraph.addVertex(product.getName());
    }

    // 2. Визначаємо нові правила сумісності (ребра)
    // --- Roses ---
    masterGraph.addEdge('Pink Rose (builder)', 'White Rose (builder)', 3);
    masterGraph.addEdge('Red Rose (builder)', 'White Rose (builder)', 3);
    masterGraph.addEdge('Pink Rose (builder)', 'Red Rose (builder)', 4);

    // --- Tulips ---
    masterGraph.addEdge('Pink Tulip (builder)', 'White Tulip (builder)', 2);
    masterGraph.addEdge('Red Tulip (builder)', 'White Tulip (builder)', 2);
    masterGraph.addEdge('Pink Tulip (builder)', 'Red Tulip (builder)', 2);

    // --- Lilies ---
    masterGraph.addEdge('Pink Lily (builder)', 'White Lily (builder)', 4);

    // --- Gerberas ---
    masterGraph.addEdge('Pink Gerbera (builder)', 'Sunflower (builder)', 6);

    // --- Mixed ---
    masterGraph.addEdge('Pink Rose (builder)', 'Pink Tulip (builder)', 5); 
    masterGraph.addEdge('White Rose (builder)', 'White Lily (builder)', 6); 
    masterGraph.addEdge('Red Rose (builder)', 'Pink Gerbera (builder)', 7); 
    
    return masterGraph;
}
