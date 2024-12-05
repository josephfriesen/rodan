import { SolutionBuilder } from "../SolutionBuilder";
import DirectedGraph from "../DirectedGraph";

export default class Day5Solution extends SolutionBuilder {
  graph: DirectedGraph = new DirectedGraph();
  updates: Array<Array<string | number>> = [];

  constructor(input: string) {
    super(5, input);
    this.initializeGraph();
    this.initializeUpdates();
  }

  initializeGraph(): void {
    const edges = Array.from(this.input.matchAll(/\d+\|\d+/g));
    for (const edge of edges) {
      const [from, to] = edge[0].split("|");
      this.graph.addEdge(from, to);
    }
  }

  initializeUpdates(): void {
    const input = this.input.split("\n");
    for (const line of input) {
      if (line.match(/\d+\|\d+/) || line === "") {
        continue;
      }
      this.updates.push(line.split(","));
    }
  }

  validateUpdate(update: Array<string | number>): boolean {
    for (let i = 0; i < update.length - 2; i++) {
      for (let j = i + 1; j < update.length - 1; j++) {
        if (!this.graph.edgeExists(update[i], update[j])) {
          return false;
        }
      }
    }
    for (let j = update.length - 1; j > 0; j--) {
      for (let i = j - 1; i >= 0; i--) {
        if (this.graph.edgeExists(update[j], update[i])) {
          return false;
        }
      }
    }

    return true;
  }

  getMiddlePage(update: Array<string | number>): string | number {
    const middle = Math.floor(update.length / 2);
    return update[middle];
  }

  get sumOfValidUpdatesPages(): number {
    return this.updates.reduce((sum, update) => {
      if (this.validateUpdate(update)) {
        return sum + Number(this.getMiddlePage(update));
      } else {
        return sum;
      }
    }, 0);
  }
}
