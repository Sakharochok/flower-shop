
import { ShopItem } from './shopItem.js';
import { Graph } from '../utils/graph.js'; // Requires graph class

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;
    
    constructor(id, name, price, image, flowers) {
        super(id, name, price, image);
        this.#flowers = flowers;
        this.#isCustom = false;
    }
    // Non-trivial methods (remain the same)
    calculateBouquetPrice() {
        const basePrice = this.getPrice();
        const flowersPrice = this.#flowers.reduce((sum, flower) => sum + flower.getPrice(), 0);
        return basePrice + flowersPrice;
    }
    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }
    // NEW NON-TRIVIAL METHOD (Graph logic remains the same)
    findOptimalFlowerConnections(graph, algorithmName = 'Kruskal') {
        const flowerNames = this.#flowers.map(f => f.getName());
        const subGraph = new Graph();
        for (const name of flowerNames) {
            subGraph.addVertex(name);
        }
        // Simplified edge addition...
        if (flowerNames.includes('Rose (Red)') && flowerNames.includes('Ribbon')) {
            subGraph.addEdge('Rose (Red)', 'Ribbon', 2);
        }
        if (subGraph.getVertices().length < 2) {
            return { mst: [], weight: 0, algorithm: algorithmName };
        }
        
        let result = subGraph.kruskalMST(); // Default to Kruskal
        return { mst: result.mst, weight: result.weight, algorithm: algorithmName };
    }
    getDescription() {
        return `Collection of ${this.#flowers.length} different flowers.`;
    }
}