export class SolutionBuilder {
  DAY: number;
  input: string;
  publicPath: string;

  constructor(day: number, input: string) {
    this.DAY = day;
    this.input = input;
  }

  day_string(): string {
    return this.DAY.toString().padStart(2, "0");
  }
}
