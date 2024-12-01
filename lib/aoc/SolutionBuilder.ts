export class SolutionBuilder {
  DAY: number;
  input: string;
  publicPath: string;

  constructor(day: number, input: string) {
    this.DAY = day;
    this.input = input;
  }

  dayString(): string {
    return this.DAY.toString().padStart(2, "0");
  }

  mapToString(map: Map<string, any>): string {
    const obj = {};
    for (let [k, v] of map) obj[k] = v;
    return `Map(${JSON.stringify(obj)})`;
  }
}
