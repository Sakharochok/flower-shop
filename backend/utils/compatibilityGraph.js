import { Graph } from './graph.js';
import { products } from '../data/products/products.js';

/**
 * Creates and exports the master compatibility graph for all products.
 * The "weight" of an edge represents the "cost" or "difficulty"
 * of assembling two components together.
 * A lower cost is better.
 */
function createMasterGraph() {
    const masterGraph = new Graph();

    // 1. Add all products from our store as vertices in the graph
    for (const product of products) {
        // We only add items that can be part of a bouquet
        // (i.e., not pre-made bouquets or vases)
        if (product.getId() < 100 || product.getId() === 200 || product.getId() === 202) {
             masterGraph.addVertex(product.getName());
        }
    }

    // 2. Define the edges (compatibility costs)
    // This is a sample set of rules for our shop
    
    // --- Roses ---
    masterGraph.addEdge('Rose (Red)', 'Silk Ribbon', 2); // Very compatible
    masterGraph.addEdge('Rose (Red)', 'Greeting Card', 1);
    masterGraph.addEdge('Rose (Red)', 'Rose (White)', 3);
    masterGraph.addEdge('Rose (Red)', 'Gerbera (Pink)', 5); // Roses and Gerberas are ok
    masterGraph.addEdge('Rose (Red)', 'Hydrangea (Pink)', 8); // Difficult pairing

    masterGraph.addEdge('Rose (White)', 'Silk Ribbon', 2);
    masterGraph.addEdge('Rose (White)', 'Hydrangea (White)', 6);

    // --- Gerberas ---
    masterGraph.addEdge('Gerbera (Pink)', 'Silk Ribbon', 3);
    masterGraph.addEdge('Gerbera (Pink)', 'Gerbera (Yellow)', 2);
    masterGraph.addEdge('Gerbera (Pink)', 'Daisy (Field)', 4);

    // --- Hydrangeas (difficult flowers) ---
    masterGraph.addEdge('Hydrangea (Pink)', 'Silk Ribbon', 7); // Hard to tie
    masterGraph.addEdge('Hydrangea (Pink)', 'Hydrangea (Blue)', 4);
    masterGraph.addEdge('Hydrangea (Blue)', 'Hydrangea (White)', 4);

    // --- Other ---
    masterGraph.addEdge('Daisy (Field)', 'Silk Ribbon', 1); // Very easy
    masterGraph.addEdge('Dianthus (Pink)', 'Gerbera (Yellow)', 3);
    masterGraph.addEdge('Tulip (Yellow)', 'Tulip (Purple)', 2);
    masterGraph.addEdge('Tulip (Yellow)', 'Daisy (Field)', 3);

    return masterGraph;
}

// Create and export the single instance of the graph
export const compatibilityGraph = createMasterGraph();