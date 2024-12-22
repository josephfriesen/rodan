export default class DirectedGraph {
  private nodes: Map<string | number, Set<string | number>> = new Map();
  private inDegrees: Map<string | number, number> = new Map();
  private outDegrees: Map<string | number, number> = new Map();

  addEdge(from: string | number, to: string | number): void {
    if (!this.nodes.has(from)) {
      this.nodes.set(from, new Set());
      this.inDegrees.set(from, 0);
    }
    if (!this.nodes.has(to)) {
      this.nodes.set(to, new Set());
      this.outDegrees.set(to, 0);
    }
    this.nodes.get(from)?.add(to);
    this.outDegrees.set(from, (this.outDegrees.get(from) || 0) + 1);
    this.inDegrees.set(to, (this.inDegrees.get(to) || 0) + 1);
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
}
