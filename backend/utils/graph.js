// backend/utils/graph.js
/**
 * Helper class for Disjoint Set Union (DSU) structure used in Kruskal's algorithm.
 * @class
 */
// Helper class for Disjoint Set Union (DSU) used in Kruskal's
class DSU {
    #parent;
    constructor(vertices) {
        this.#parent = new Map();
        for (const v of vertices) {
            this.#parent.set(v, v);
        }
    }
    find(i) {
        if (!this.#parent.has(i)) return undefined; // (FIX) Handle missing vertex
        if (this.#parent.get(i) === i) {
            return i;
        }
        this.#parent.set(i, this.find(this.#parent.get(i)));
        return this.#parent.get(i);
    }
    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ && rootI !== undefined && rootJ !== undefined) {
            this.#parent.set(rootI, rootJ);
            return true;
        }
        return false;
    }
}
/**
 * Main Graph Class.
 * Implements methods for adding vertices, edges, and finding the Minimum Spanning Tree (MST).
 * @class
 */

// --- Main Graph Class ---
export class Graph {
    #adjacencyList;
    #edges;

    constructor() {
        this.#adjacencyList = new Map();
        this.#edges = [];
    }

    addVertex(vertex) {
        if (!this.#adjacencyList.has(vertex)) {
            this.#adjacencyList.set(vertex, []);
        }
    }
    /**
     * Adds a weighted edge between two vertices.
     * @param {string} v1 - First vertex name.
     * @param {string} v2 - Second vertex name.
     * @param {number} weight - The weight/compatibility score of the edge.
     * @throws {Error} If one of the vertices is not found.
     */
    addEdge(v1, v2, weight) {
        if (!this.#adjacencyList.has(v1)) {
            throw new Error(`Vertex ${v1} not found. Cannot add edge.`);
        }
        if (!this.#adjacencyList.has(v2)) {
            throw new Error(`Vertex ${v2} not found. Cannot add edge.`);
        }
        this.#adjacencyList.get(v1).push({ node: v2, weight: weight });
        this.#adjacencyList.get(v2).push({ node: v1, weight: weight });
        this.#edges.push({ v1, v2, weight });
    }

    removeEdge(v1, v2) {
        this.#adjacencyList.set(v1, this.#adjacencyList.get(v1).filter(edge => edge.node !== v2));
        this.#adjacencyList.set(v2, this.#adjacencyList.get(v2).filter(edge => edge.node !== v1));
        this.#edges = this.#edges.filter(e => !(
            (e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)
        ));
    }

    getEdges() {
        return this.#edges;
    }
    getVertices() {
        return Array.from(this.#adjacencyList.keys());
    }
    /**
     * Finds the Minimum Spanning Tree (MST) using Kruskal's algorithm.
     * @method
     * @returns {Object} Returns { mst: Array, weight: number }.
     */
    // (FIX) THIS IS THE CORRECT KRUSKAL FUNCTION
    kruskalMST() {
        const sortedEdges = [...this.#edges].sort((a, b) => a.weight - b.weight);
        const dsu = new DSU(this.getVertices());
        const mst = [];
        
        // (FIX) mstWeight MUST be initialized to 0
        let mstWeight = 0; 

        for (const edge of sortedEdges) {
            if (dsu.union(edge.v1, edge.v2)) {
                mst.push(edge);
                // (FIX) Ensure weight is a number
                mstWeight += (edge.weight || 0); 
            }
        }
        // (FIX) It MUST return both mst and weight
        return { mst, weight: mstWeight };
    }
    /**
     * Finds the Minimum Spanning Tree (MST) using Prim's algorithm.
     * @method
     * @param {string} startVertex - The starting vertex for the traversal.
     * @returns {Object} Returns { mst: Array, weight: number }.
     */
    // (This function is also fixed for safety)
    primMST(startVertex) {
        const vertices = this.getVertices();
        if (vertices.length === 0) return { mst: [], weight: 0 };
        if (!vertices.includes(startVertex)) {
            startVertex = vertices[0]; 
        }

        const distances = new Map(vertices.map(v => [v, Infinity]));
        const parents = new Map(vertices.map(v => [v, null]));
        const visited = new Set();
        distances.set(startVertex, 0);

        const mst = [];
        let mstWeight = 0;
        let unvisited = [...vertices];

        while (unvisited.length > 0) {
            let minDistance = Infinity;
            let currentVertex = null;
            let minIndex = -1;

            for (let i = 0; i < unvisited.length; i++) {
                const v = unvisited[i];
                if (distances.get(v) < minDistance) {
                    minDistance = distances.get(v);
                    currentVertex = v;
                    minIndex = i;
                }
            }

            if (currentVertex === null) break;

            unvisited.splice(minIndex, 1);
            visited.add(currentVertex);
            
            if (parents.get(currentVertex) !== null) {
                const parent = parents.get(currentVertex);
                const weight = distances.get(currentVertex);
                mst.push({ v1: parent, v2: currentVertex, weight });
                mstWeight += (weight || 0);
            }

            for (const edge of this.#adjacencyList.get(currentVertex)) {
                if (!visited.has(edge.node) && edge.weight < distances.get(edge.node)) {
                    distances.set(edge.node, edge.weight);
                    parents.set(edge.node, currentVertex);
                }
            }
        }
        return { mst, weight: mstWeight };
    }
}