export type Node = string | number;

export default class DirectedGraph {
  nodes: Map<string | number, Set<string | number>> = new Map();
  inDegrees: Map<string | number, number> = new Map();
  outDegrees: Map<string | number, number> = new Map();
  weights: Map<string | number, Map<string | number, number>> = new Map();

  addVertex(v: string | number): void {
    this.nodes.set(v, new Set());
    this.inDegrees.set(v, 0);
    this.outDegrees.set(v, 0);
    this.weights.set(v, new Map());
  }

  addEdge(
    from: string | number,
    to: string | number,
    weight: number = 1
  ): void {
    if (!this.nodes.has(from)) {
      this.addVertex(from);
    }
    if (!this.nodes.has(to)) {
      this.addVertex(to);
    }
    this.nodes.get(from)?.add(to);
    this.outDegrees.set(from, (this.outDegrees.get(from) || 0) + 1);
    this.inDegrees.set(to, (this.inDegrees.get(to) || 0) + 1);
    this.weights.get(from)?.set(to, weight);
  }

  removeEdge(from: string | number, to: string | number): void {
    this.nodes.get(from)?.delete(to);
    this.outDegrees.set(from, (this.outDegrees.get(from) || 0) - 1);
    this.inDegrees.set(to, (this.inDegrees.get(to) || 0) - 1);
  }

  getNodes(): Map<string | number, Set<string | number>> {
    return this.nodes;
  }

  getNode(node: string | number): Set<string | number> | undefined {
    return this.nodes.get(node);
  }

  getInDegrees(): Map<string | number, number> {
    return this.inDegrees;
  }

  getOutDegrees(): Map<string | number, number> {
    return this.outDegrees;
  }

  getDegree(node: string | number): number {
    return (this.inDegrees.get(node) || 0) as number;
  }

  getWeights(node: string | number): Map<string | number, number> {
    const weights = this.weights.get(node);
    if (!weights) {
      throw new Error(
        `graph is ill-defined, weights for node ${node} does not exist`
      );
    }
    return weights;
  }

  nodeExists(from: string | number): boolean {
    return this.nodes.has(from);
  }

  edgeExists(from: string | number, to: string | number): boolean {
    return !!this.nodeExists(from) && !!this.nodes.get(from)?.has(to);
  }

  pathExists(from: string | number, to: string | number): boolean {
    // BFS search from to find if there is a path starting at node from ending at node to.
    const queue = [from];
    while (queue.length > 0) {
      const node = queue.shift();
      if (node !== undefined) {
        if (node === to) {
          return true;
        }
        this.nodes.get(node)?.forEach((n) => {
          queue.push(n);
        });
      }
    }
    return false;
  }

  DFS(node: string | number, visited = {}, stack: Array<string | number> = []) {
    visited[node] = true;
    const neighborhood = this.getNode(node);
    if (neighborhood) {
      for (const neighbor of neighborhood) {
        if (!visited[neighbor]) {
          this.DFS(neighbor, visited, stack);
        }
      }
    }
    stack.push(node);
  }

  Dijkstra(u: string | number): {
    distances: { [key: string | number]: number };
    previous: { [key: string | number]: string | number };
  } {
    let queue: Array<string | number> = [];
    const distances = {};
    const previous = {};
    for (const vertex of this.nodes.keys()) {
      queue.push(vertex);
      distances[vertex] = Infinity;
    }
    distances[u] = 0;

    while (queue.length > 0) {
      queue = queue.sort((x, y) => {
        return distances[x] - distances[y];
      });

      const current: string | number = queue.shift() as string | number;
      const neighbors: Set<string | number> | undefined = this.getNode(current);
      if (!neighbors) {
        continue;
      }
      for (const neighbor of neighbors) {
        const newDistance =
          distances[current] + this.weights.get(current)?.get(neighbor);
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    }

    return { distances, previous };
  }

  minWeightPath(
    u: string | number,
    v: string | number
  ): Array<string | number> {
    const dijkstra = this.Dijkstra(u);
    const { previous, distances } = dijkstra;
    if (!distances[v] || distances[v] === Infinity) {
      return [];
    }
    let current = v;
    const path: Array<string | number> = [v];
    while (current !== u) {
      current = previous[current];
      path.unshift(current);
    }
    return path;
  }
}
