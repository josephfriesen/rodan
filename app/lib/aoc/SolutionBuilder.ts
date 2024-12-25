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

  mod(n: number, modulo: number) {
    return ((n % modulo) + modulo) % modulo;
  }

  c(...args: any[]) {
    console.log(...args); // eslint-disable-line no-console
  }
}
