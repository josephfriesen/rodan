import DirectedGraph from "./DirectedGraph";

export default class DirectedAcyclicGraph extends DirectedGraph {
  topologicalSort(): Array<string | number> {
    const stack = [];
    const visited = {};
    for (const [node] of this.getNodes()) {
      visited[node] = false;
    }

    for (const [node] of this.getNodes()) {
      if (!visited[node]) {
        this.DFS(node, visited, stack);
      }
    }

    return stack.reverse();
  }

  countPaths(source: string | number, dest: string | number) {
    let sum = 0;

    /* DFS on acyclic graph. graph must be acyclic, otherwise since this is
     * not keeping track of visited nodes, will eventually lead to infinite loop.
     */
    const search = (v: string | number): void => {
      const neighborhood: Set<string | number> | undefined = this.getNode(v);
      if (neighborhood) {
        for (const neighbor of neighborhood) {
          if (neighbor === dest) {
            sum++;
          }
          search(String(neighbor));
        }
      }
    };

    search(source);
    return sum;
  }
}
