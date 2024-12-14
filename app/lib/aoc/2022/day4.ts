import { SolutionBuilder } from "../SolutionBuilder";

export interface Elf extends Map<string, number> {
  get(key: "start"): number | undefined;
  get(key: "end"): number | undefined;
}

interface OverlapResult {
  overlap: number;
  disjoint: number;
}

export class Day4Solution extends SolutionBuilder {
  elfPairs: Array<Array<Elf>>;
  sortedElfPairs: Array<Array<Elf>>;
  redundancyCount: number;
  overlapCount: number;
  disjointCount: number;

  constructor(input: string) {
    super(4, input);
    this.elfPairs = this.inputToElfPairs(input);
    this.sortedElfPairs = this.elfPairsToSortedElfPairs(this.elfPairs);
    this.redundancyCount = this.sumRedundancies();

    const { disjoint, overlap } = this.sumOverlaps();
    this.overlapCount = overlap;
    this.disjointCount = disjoint;
  }

  private stringToElfPair(s: string): Array<Elf> {
    // s: string of format "(number)-(number),(number)-(number)"
    const stringPairs: Array<string> = s.split(",");
    const elves = stringPairs.map((elf: string): Elf => {
      const coordinates = elf.split("-");
      return new Map([
        ["start", parseInt(coordinates[0])],
        ["end", parseInt(coordinates[1])],
      ]);
    });
    return elves;
  }

  private inputToElfPairs(): Array<Array<Elf>> {
    const lines: Array<string> = this.input
      .split("\n")
      .map((line) => line.trim());
    return lines.map((l: string) => {
      return this.stringToElfPair(l);
    });
  }

  private elfPairsToSortedElfPairs(
    pairs: Array<Array<Elf>>
  ): Array<Array<Elf>> {
    return this.sortPairsList(pairs);
  }

  private sortPair(pair: Array<Elf>): Array<Elf> {
    return pair.sort((elf1: Elf, elf2: Elf) => {
      // must ensure pairs are sorted first by start.
      // then, if starts are equal, must sort the elf with the larger end first
      // to ensure comparison methods work correctly, otherwise will undercount redundancies
      if (elf1.get("start") === elf2.get("start")) {
        return elf2.get("end") - elf1.get("end");
      }

      return elf1.get("start") - elf2.get("start");
    });
  }

  private sortPairsList(list: Array<Array<Elf>>): Array<Array<Elf>> {
    return list
      .map((pair) => this.sortPair(pair))
      .sort(
        (a: Array<Elf>, b: Array<Elf>) => a[0].get("start") - b[0].get("start")
      );
  }

  compareElfPairForRedundancy(elfPair: Array<Elf>): boolean {
    // first attempt 736 too high
    // second attempt 356 too low
    const [e, f] = elfPair;

    // the elves are sorted such that e.start is <= f.start. therefore, they are redundant if and only if e.end >= f.end
    return e.get("end") >= f.get("end");
  }

  compareElfPairForOverlap(elfPair: Array<Elf>): boolean {
    // let E1 = (x1, y1), E2 = (x2, y2) be elves with start = x and end = y.
    // because the pairs are sorted first by start then by end, we know that
    //   (1) x1 <= x2
    //   (2) if (x1 = x2)  then y2 <= y1
    // case 1: x1 < x2
    //   E1 and E2 overlap iff y1 >= x2
    // case 2: x1 = x2
    //   E1 and E2 always overlap at minimum in section x1.
    const [E1, E2] = elfPair;
    const x1 = E1.get("start");
    const y1 = E1.get("end");
    const x2 = E2.get("start");
    // const y2 = E2.get("end");
    return x1 === x2 || y1 >= x2;
  }

  sumRedundancies(): number {
    let count = 0;
    for (const pair of this.sortedElfPairs) {
      if (this.compareElfPairForRedundancy(pair)) {
        count++;
      }
    }

    return count;
  }

  sumOverlaps(): OverlapResult {
    let count = 0;
    let disjoint = 0;
    for (const pair of this.sortedElfPairs) {
      if (this.compareElfPairForOverlap(pair)) {
        count++;
      } else {
        disjoint++;
      }
    }

    return { overlap: count, disjoint };
  }

  elfPairsDemo(elfPairs: Array<Array<Elf>>): string {
    let stringRepresentation = "";
    for (const pair of elfPairs) {
      stringRepresentation += "[ ";
      stringRepresentation += this.mapToString(pair[0]);
      stringRepresentation += ", ";
      stringRepresentation += this.mapToString(pair[1]);
      stringRepresentation += ` ],
`;
    }
    return stringRepresentation;
  }

  get firstThreeElfPairs(): Array<Array<Elf>> {
    return this.elfPairs.slice(0, 3);
  }

  get firstThreeSortedElfPairs(): Array<Array<Elf>> {
    return this.sortedElfPairs.slice(0, 3);
  }

  test(): void {
    const first = new Map([
      ["start", 55],
      ["end", 55],
    ]);

    const second = new Map([
      ["start", 55],
      ["end", 54],
    ]);

    console.log(first);
    console.log(second);
    console.log(
      this.compareElfPairForRedundancy(this.sortPair([first, second]))
    );
    console.log(this.compareElfPairForOverlap(this.sortPair([first, second])));
    console.log(this.overlapCount);
  }

  printElfPairs(): void {
    for (const pair of this.elfPairs) {
      console.log(pair);
    }
  }
}

export default Day4Solution;
