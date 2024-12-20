export class SolutionBuilder {
  DAY: number;
  input: string;
  publicPath: string;
  solutions: { [key: string]: number };

  constructor(day: number, input: string) {
    this.DAY = day;
    this.input = input;
    this.solutions = {};
  }

  dayString(): string {
    return this.DAY.toString().padStart(2, "0");
  }
}
