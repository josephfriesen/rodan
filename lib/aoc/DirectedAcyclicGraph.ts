import DirectedGraph from "./DirectedGraph";

export default class DirectedAcyclicGraph extends DirectedGraph {
  pathExists(from: string | number, to: string | number): boolean {
    return super.pathExists(from, to) && this.getDegree(from) === 1;
  }

  topologicalSort(): Array<string | number> {
    const sorted: Array<string | number> = [];
    const visited: Set<string | number> = new Set();
    const stack: Array<string | number> = [];

    for (const node of this.getNodes().keys()) {
      if (!visited.has(node)) {
        stack.push(node);
      }
    }

    while (stack.length > 0) {
      const node = stack.pop();
      if (node) {
        sorted.push(node);
        visited.add(node);
        this.getNode(node)?.forEach((n) => {
          if (!visited.has(n)) {
            stack.push(n);
          }
        });
      }
    }

    return sorted;
  }
}
