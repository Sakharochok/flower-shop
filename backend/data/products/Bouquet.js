import { ShopItem } from './ShopItem.js';
import { Graph } from '../../utils/graph.js';

export class Bouquet extends ShopItem {
    #flowers;
    #isCustom;

    constructor(id, name, price, image, flowers) {
        super(id, name, price, image);
        this.#flowers = flowers;
        this.#isCustom = false;
    }

    addFlower(flower) {
        this.#flowers.push(flower);
        this.#isCustom = true;
    }
    
    // Метод тепер коректно використовує переданий граф
    findOptimalFlowerConnections(graph, algorithmName = 'Kruskal') {
        const flowerNames = this.#flowers.map(f => f.getName());
        
        // Перевірка, чи достатньо вершин для побудови дерева
        if (flowerNames.length < 2) {
            return { mst: [], weight: 0, algorithm: algorithmName };
        }

        // Створення підграфу на основі квітів у букеті
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
        
        // Виклик алгоритму на підграфі
        let result = subGraph.kruskalMST(); // За замовчуванням Kruskal
        if (algorithmName === 'Prim' && subGraph.getVertices().length > 0) {
           result = subGraph.primMST(subGraph.getVertices()[0]);
        }
        
        return { mst: result.mst, weight: result.weight, algorithm: algorithmName };
    }

    getDescription() {
        const flowerCount = this.#flowers.length;
        return `A beautiful collection of ${flowerCount} flowers.`;
    }
}