import DirectedGraph from "./DirectedGraph";

export default class DirectedAcyclicGraph extends DirectedGraph {
  pathExists(from: string | number, to: string | number): boolean {
    // return super.pathExists(from, to) && this.getDegree(from) === 1;
    return super.pathExists(from, to);
  }


  DFS(node, visited, stack) {
      visited[node] = true;
      for (const neighbor of this.getNode(node)) {
          if (!visited[neighbor]) {
              this.DFS(neighbor, visited, stack);
          }
      }
      stack.push(node);
  }

  topologicalSort(): Array<string | number> {
      let stack = [];
      let visited = {};
      for (const [node, adj] of this.getNodes()) {
          visited[node] = false;
      }

      for (const [node, adj] of this.getNodes()) {
          if (!visited[node]) {
              this.DFS(node, visited, stack);
          }
      }

      return stack.reverse();
  }
}
