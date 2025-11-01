// backend/utils/compatibilityGraph.js

import { Graph } from './graph.js';
// We are importing the NEW product list
import { products } from '../data/products/products.js';

/**
 * Creates and exports the updated compatibility graph.
 */
function createMasterGraph() {
    const masterGraph = new Graph();

    // 1. Add ALL products (including bouquets) as vertices
    // This fixes the "Vertex not found" error
    for (const product of products) {
        masterGraph.addVertex(product.getName());
    }

    // 2. Define the new compatibility rules (edges)
    // We are ONLY using the builder flower names (with "(builder)")

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

// Create and export the single instance of the graph
export const compatibilityGraph = createMasterGraph();