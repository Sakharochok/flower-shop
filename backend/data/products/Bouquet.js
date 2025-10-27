// backend/data/products/Bouquet.js

import { ShopItem } from './ShopItem.js';
import { Graph } from '../../utils/graph.js'; // Requires graph class

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;

    constructor(id, name, price, image, flowers) {
        super(id, name, price, image);
        // Ensure flowers is always an array
        this.#flowers = Array.isArray(flowers) ? flowers : [];
        this.#isCustom = false;
    }

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
    // Provides a more generic description suitable even when
    // the #flowers array isn't populated by the factory.
    getDescription() {
        // Return a general description for pre-made bouquets
        return `A beautiful pre-arranged collection of flowers.`;
    }
    // --- End of update ---

    // You might also want a method to get the actual flowers if needed later
    getFlowers() {
      return this.#flowers;
    }
}