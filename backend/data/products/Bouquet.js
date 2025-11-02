// backend/data/products/Bouquet.js

import { ShopItem } from './ShopItem.js';
import { Graph } from '../../utils/graph.js'; // Requires graph class

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;
    #mainColor;
    #season;

    constructor(id, name, price, image, flowers, mainColor, season) {
        super(id, name, price, image);
        this.#flowers = Array.isArray(flowers) ? flowers : [];
        this.#isCustom = false;
        this.#mainColor = mainColor || 'Mixed';
        this.#season = season || 'All-Year';
    }
    
    getMainColor() { return this.#mainColor; }
    getSeason() { return this.#season; }

    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }

    // (FIX) This is the confirmed working version of this function
    findOptimalFlowerConnections(graph, algorithmName = 'Kruskal') {
        // 1. Get the names of the flowers in *this* bouquet
        const flowerNames = this.#flowers.map(f => f.getName());

        if (flowerNames.length < 2) {
            return { mst: [], weight: 0, algorithm: algorithmName };
        }

        // 2. Create a new, empty subgraph
        const subGraph = new Graph();
        
        // 3. Add only *our* flowers as vertices to the subgraph
        for (const name of flowerNames) {
            // Check if the flower name exists in the master graph before adding
            if (graph.getVertices().includes(name)) {
                subGraph.addVertex(name);
            }
        }

        // 4. Add only the relevant edges (that connect *our* flowers)
        for (const edge of graph.getEdges()) {
            if (flowerNames.includes(edge.v1) && flowerNames.includes(edge.v2)) {
                subGraph.addEdge(edge.v1, edge.v2, edge.weight);
            }
        }

        // 5. Run Kruskal's algorithm *on the subgraph*
        // This will correctly return { mst: [], weight: 0 } if no edges were found
        let result = subGraph.kruskalMST(); 

        if (algorithmName === 'Prim' && subGraph.getVertices().length > 0) {
           result = subGraph.primMST(subGraph.getVertices()[0]);
        }

        // 6. Return the result. result.weight will be 0 if no connections exist
        return { mst: result.mst, weight: result.weight, algorithm: algorithmName };
    }

    getDescription() {
        return `A beautiful pre-arranged collection of flowers.`;
    }
    
    getFlowers() {
      return this.#flowers;
    }
}