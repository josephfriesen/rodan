import { SolutionBuilder } from "../SolutionBuilder";
import DirectedAcyclicGraph from "../DirectedAcyclicGraph";

export default class Day5Solution extends SolutionBuilder {
  graph: DirectedAcyclicGraph = new DirectedAcyclicGraph();
  updates: Array<Array<string | number>> = [];

  constructor(input: string) {
    super(5, input);
    this.initializeGraph();
    this.initializeUpdates();
  }

  initializeGraph(): void {
    const edges: Array<RegExpMatchArray> = Array.from(
      this.input.matchAll(/\d+\|\d+/g),
    );
    for (const edge of edges) {
      const [from, to]: Array<string> = edge[0].split("|");
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

  isValidUpdate(update: Array<string | number>): boolean {
    for (let j = update.length - 1; j > 0; j--) {
      for (let i = j - 1; i >= 0; i--) {
        if (this.graph.edgeExists(update[j], update[i])) {
          return false;
        }
      }
    }

    return true;
  }

  correctUpdate(update: Array<string | number>): Array<string | number> {
    const corrected: Array<string | number> = [...update];
    while (!this.isValidUpdate(corrected)) {
      for (let i = 0; i < corrected.length; i++) {
        for (let j = i + 1; j < corrected.length; j++) {
          if (this.graph.edgeExists(corrected[j], corrected[i])) {
            [corrected[i], corrected[j]] = [corrected[j], corrected[i]];
          }
        }
      }
    }
    return corrected;
  }

  getMiddlePage(update: Array<string | number>): string | number {
    const middle: number = Math.floor(update.length / 2);
    return update[middle];
  }

  get sumOfValidUpdatesPages(): number {
    return this.updates.reduce((sum, update) => {
      if (this.isValidUpdate(update)) {
        return sum + Number(this.getMiddlePage(update));
      } else {
        return sum;
      }
    }, 0);
  }

  get sumOfCorrectedUpdatesPages(): number {
    return this.updates.reduce((sum, update) => {
      if (this.isValidUpdate(update)) {
        return sum;
      } else {
        return sum + Number(this.getMiddlePage(this.correctUpdate(update)));
      }
    }, 0);
  }
}
