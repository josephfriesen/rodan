import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";

export default class Day19Solution extends SolutionBuilder {
  Patterns: string[];
  Designs: string[];
  Dictionary: { [key: string]: boolean };
  CombinationCount: { [key: string]: number };

  constructor(input: string) {
    super(19, input);
    this.parseInput();
    this.initDictionaries();
  }

  private parseInput(): void {
    const split: string[] = this.input.split("\n");
    this.Patterns = split[0].split(", ");
    this.Designs = split.slice(2, split.length);
  }

  private initDictionaries(): void {
    this.Dictionary = {};
    this.CombinationCount = {};
  }

  testPattern(pattern: string, design: string): boolean {
    return design.slice(0, pattern.length) === pattern;
  }

  testHalves(design: string, index: number) {
    return (
      this.Dictionary[design.slice(0, index)] &&
      this.Dictionary[design.slice(index)]
    );
  }

  buildable(design: string): boolean {
    const search = (startIndex: number): void => {
      if (this.Dictionary[design] === true) {
        return;
      }

      if (this.testHalves(design, startIndex)) {
        this.Dictionary[design] = true;
        return;
      }

      if (startIndex >= design.length) {
        return;
      }

      for (const pattern of this.Patterns) {
        const endIndex: number = startIndex + pattern.length;
        const test: string = design.slice(startIndex, endIndex);
        if (this.testPattern(pattern, test)) {
          this.Dictionary[design.slice(0, endIndex)] = true;
          search(endIndex);
        }
      }
    };

    search(0);

    return !!this.Dictionary[design];
  }

  get countBuildableDesigns(): number {
    return this.Designs.reduce((acc, curr) => {
      const buildable: string[] | boolean = this.buildable(curr);
      if (buildable) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  designCombinations(design: string): number {
    if (this.CombinationCount[design]) {
      return this.CombinationCount[design];
    }

    const count = (curr: string): number => {
      if (curr === "") {
        return 1;
      }

      if (this.CombinationCount[curr]) {
        return this.CombinationCount[curr];
      }

      let num = 0;
      for (const pattern of this.Patterns) {
        if (this.testPattern(pattern, curr)) {
          num += count(curr.slice(pattern.length));
        }
      }

      this.CombinationCount[curr] = num;
      return num;
    };

    return count(design);
  }

  get totalCombinations(): number {
    return this.Designs.reduce((acc, curr) => {
      return acc + this.designCombinations(curr);
    }, 0);
  }

  setSolutions(): void {
    this.solutions["countBuildableDesigns"] = this.countBuildableDesigns;
    this.solutions["totalCombinations"] = this.totalCombinations;
  }
}
