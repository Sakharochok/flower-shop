// backend/data/products/Bouquet.js

import { ShopItem } from './ShopItem.js';
import { Graph } from '../../utils/graph.js'; // Requires graph class

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;
    #mainColor; // <-- NEW
    #season;    // <-- NEW

    constructor(id, name, price, image, flowers, mainColor, season) {
        super(id, name, price, image);
        // Ensure flowers is always an array
        this.#flowers = Array.isArray(flowers) ? flowers : [];
        this.#isCustom = false;
        
        // --- NEW ---
        this.#mainColor = mainColor || 'Mixed'; // Default value
        this.#season = season || 'All-Year';   // Default value
    }
    
    // --- NEW Getters ---
    getMainColor() { return this.#mainColor; }
    getSeason() { return this.#season; }
    // --- End New Getters ---

    // Non-trivial method
    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }

    // Non-trivial method (Graph logic)
    findOptimalFlowerConnections(graph, algorithmName = 'Kruskal') {
        const flowerNames = this.#flowers.map(f => f.getName());

        if (flowerNames.length < 2) {
            return { mst: [], weight: 0, algorithm: algorithmName };
        }

        // Create subgraph based on bouquet flowers
        const subGraph = new Graph();
        for (const name of flowerNames) {
            if (graph.getVertices().includes(name)) {
                subGraph.addVertex(name);
            }
        }

        for (const edge of graph.getEdges()) {
            if (flowerNames.includes(edge.v1) && flowerNames.includes(edge.v2)) {
                subGraph.addEdge(edge.v1, edge.v2, edge.weight);
            }
        }

        let result = subGraph.kruskalMST();
        if (algorithmName === 'Prim' && subGraph.getVertices().length > 0) {
           result = subGraph.primMST(subGraph.getVertices()[0]);
        }

        return { mst: result.mst, weight: result.weight, algorithm: algorithmName };
    }

    // --- UPDATED getDescription Method ---
    getDescription() {
        return `A beautiful pre-arranged collection of flowers.`;
    }
    // --- End of update ---

    getFlowers() {
      return this.#flowers;
    }
}