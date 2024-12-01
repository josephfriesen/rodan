import next from "next";
import { SolutionBuilder } from "../SolutionBuilder";

export class Day1Solution extends SolutionBuilder {
  sortedListLeft: Array<number>;
  sortedListRight: Array<number>;
  distances: Array<number>;

  constructor(input: string) {
    super(1, input);
    this.sortedListLeft = [];
    this.sortedListRight = [];
    this.distances = [];
    this.inputToSortedLists();
  }

  private inputToSortedLists(): void {
    const lines: Array<string> = this.input.split("\n");
    for (const line of lines) {
      const ids: Array<string> = line.split("   ");
      if (ids.length !== 2 || Number.isNaN(ids[0]) || Number.isNaN(ids[1])) {
        continue;
      }
      this.sortedListLeft.push(parseInt(ids[0])); 
      this.sortedListRight.push(parseInt(ids[1]));
    }
    this.sortedListLeft = this.sortedListLeft.sort().reverse();
    this.sortedListRight = this.sortedListRight.sort().reverse();
    this.calculateDistances();
  }

  private calculateDistances(): void {
    let i = 0;
    for (const left of this.sortedListLeft) {
      const right = this.sortedListRight[i]
      this.distances[i] = Math.abs(left - right);
      i++;
    }
  }

  get totalDistance(): number {
    return this.distances.reduce((acc, curr) => acc + curr, 0);
  }

  test(): void {
    console.log(`== [this.totalDistance] ==: ${this.totalDistance}`)
  }
}

export default Day1Solution;