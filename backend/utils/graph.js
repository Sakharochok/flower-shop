// backend/utils/graph.js

// Helper class for Disjoint Set Union (DSU) used in Kruskal's
class DSU {
    #parent;
    constructor(vertices) {
        this.#parent = new Map();
        for (const v of vertices) {
            this.#parent.set(v, v);
        }
    }
    // Non-trivial method: Find the representative of the set containing vertex i (with path compression)
    find(i) {
        if (this.#parent.get(i) === i) {
            return i;
        }
        this.#parent.set(i, this.find(this.#parent.get(i)));
        return this.#parent.get(i);
    }
    // Non-trivial method: Union of two sets
    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.#parent.set(rootI, rootJ);
            return true;
        }
        return false;
    }
}

// --- Main Graph Class ---
export class Graph {
    #adjacencyList;
    #edges;

    constructor() {
        this.#adjacencyList = new Map();
        this.#edges = [];
    }

    // Non-trivial method: Adds a vertex (flower, decor, etc.)
    addVertex(vertex) {
        if (!this.#adjacencyList.has(vertex)) {
            this.#adjacencyList.set(vertex, []);
        }
    }

    // Non-trivial method: Adds an edge with weight (e.g., compatibility or connection cost)
    // Weight is the cost/compatibility index
    addEdge(v1, v2, weight) {
        if (!this.#adjacencyList.has(v1) || !this.#adjacencyList.has(v2)) {
            throw new Error("Vertex not found in graph.");
        }
        // Add edge to adjacency list (undirected graph)
        this.#adjacencyList.get(v1).push({ node: v2, weight: weight });
        this.#adjacencyList.get(v2).push({ node: v1, weight: weight });

        // Add to edge list for Kruskal's
        this.#edges.push({ v1, v2, weight });
    }

    // Non-trivial method: Removes an edge
    removeEdge(v1, v2) {
        // Remove from adjacency list for v1
        this.#adjacencyList.set(v1, this.#adjacencyList.get(v1).filter(edge => edge.node !== v2));
        // Remove from adjacency list for v2
        this.#adjacencyList.set(v2, this.#adjacencyList.get(v2).filter(edge => edge.node !== v1));
        // Remove from edge list
        this.#edges = this.#edges.filter(e => !(
            (e.v1 === v1 && e.v2 === v2) || (e.v1 === v2 && e.v2 === v1)
        ));
    }

    // Getter for edges (needed for Kruskal's)
    getEdges() {
        return this.#edges;
    }
    // Getter for vertices (needed for Prim's)
    getVertices() {
        return Array.from(this.#adjacencyList.keys());
    }

    // Non-trivial method (Algorithm 1): Kruskal's Algorithm for Minimum Spanning Tree
    // Kruskal's is generally better for sparse graphs
    kruskalMST() {
        // Sort edges by weight
        const sortedEdges = [...this.#edges].sort((a, b) => a.weight - b.weight);
        const dsu = new DSU(this.getVertices());
        const mst = [];
        let mstWeight = 0;

        for (const edge of sortedEdges) {
            if (dsu.union(edge.v1, edge.v2)) {
                mst.push(edge);
                mstWeight += edge.weight;
            }
        }
        return { mst, weight: mstWeight };
    }

    // Non-trivial method (Algorithm 2): Prim's Algorithm for Minimum Spanning Tree
    // Prim's is generally better for dense graphs
    primMST(startVertex) {
        const vertices = this.getVertices();
        if (!vertices.includes(startVertex)) {
            throw new Error("Start vertex not found.");
        }

        const distances = new Map(vertices.map(v => [v, Infinity]));
        const parents = new Map(vertices.map(v => [v, null]));
        const visited = new Set();
        distances.set(startVertex, 0);

        const mst = [];
        let mstWeight = 0;
        let unvisited = [...vertices];

        while (unvisited.length > 0) {
            // Find the unvisited vertex with the minimum distance (simulated priority queue)
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

            if (currentVertex === null) break; // Disconnected graph

            // Move current vertex from unvisited to visited
            unvisited.splice(minIndex, 1);
            visited.add(currentVertex);
            
            if (parents.get(currentVertex) !== null) {
                // Add the edge that led to this vertex in the MST
                const parent = parents.get(currentVertex);
                const weight = distances.get(currentVertex);
                mst.push({ v1: parent, v2: currentVertex, weight });
                mstWeight += weight;
            }

            // Update distances for neighbors
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