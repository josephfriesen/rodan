export class SolutionBuilder {
  DAY: number;
  input: string;
  publicPath: string;
  hash: string;

  constructor(day: number, input: string) {
    this.DAY = day;
    this.input = input;
    this.hash = `solution-${this.DAY}-${SolutionBuilder.hashCode(input)}`;
  }

  dayString(): string {
    return this.DAY.toString().padStart(2, "0");
  }

  mapToString(map: Map<string, any>): string {
    const obj = {};
    for (let [k, v] of map) obj[k] = v;
    return `Map(${JSON.stringify(obj)})`;
  }

  static hashCode(str: string): number {
    return [...str].reduce(
      (s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0,
      0
    );
  }

  initCache(): void {
    if (!this.isCached) {
      window.localStorage.setItem(this.hash, "{}");
    }
  }

  cacheSolution(key: string, value: any): void {
    window.localStorage.setItem(
      this.hash,
      JSON.stringify({ ...this.cachedSolution, [key]: value })
    );
  }

  get cachedSolution(): any {
    return JSON.parse(window.localStorage.getItem(this.hash) || "{}");
  }

  clearCache(): void {
    window.localStorage.removeItem(this.hash);
  }

  get isCached(): boolean {
    return window.localStorage.getItem(this.hash) !== null;
  }
}
