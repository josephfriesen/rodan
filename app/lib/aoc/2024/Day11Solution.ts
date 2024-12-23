import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";

export default class Day11Solution extends SolutionBuilder {
  initial: Array<number>;
  zeroPath: Array<number>;
  blinkDict: Map<number, number>;

  constructor(input: string) {
    super(11, input);
    this.setInitial();
    this.setZeroPath();
    this.setSolution();
  }

  private zeroRule(): number {
    return 1;
  }

  private splitRule(n: number, digits: number): [number, number] {
    const factor = 10 ** (digits / 2);
    const left = Math.floor(n / factor);
    const right = Math.round(((n / factor) % 1) * factor);
    return [left, right];
  }

  private multRule(n: number): number {
    return n * 2024;
  }

  private transform(n: number) {
    if (n === 0) return this.zeroRule();
    const digits = Math.floor(Math.log10(n)) + 1;
    if (digits % 2 === 0) return this.splitRule(n, digits);
    return this.multRule(n);
  }

  blink(numbers: number[]): number[] {
    return numbers.map((n) => this.transform(n)).flat();
  }

  countNumbersAfterBlinks(numbers: number[], times: number): number {
    let count = 0;
    let out = [...numbers];
    for (let i = 1; i <= times; i++) {
      out = this.blink(out);
      out = out.filter((num) => {
        if (num === 0) {
          count += this.zeroPath[times - i];
          return false;
        }
        return true;
      });
    }
    return count + out.length;
  }

  private setZeroPath(): void {
    const blinkState: Array<Array<number>> = [[0]];
    for (let i = 1; i <= 25; i++) {
      blinkState[i] = this.blink(blinkState[i - 1]);
    }
    this.zeroPath = blinkState.map((arr) => arr.length);
  }

  private setInitial(): void {
    this.initial = this.input.split(" ").map((n) => Number(n));
  }

  get totalAfterBlinks(): number {
    return this.countNumbersAfterBlinks(this.initial, 25);
  }

  memoizedCountAfterBlinks(numbers: number[], times: number) {
    let blinkMap: Map<number, number> = new Map();

    for (const num of numbers) {
      blinkMap.set(num, 1);
    }

    for (let i = 1; i <= times; i++) {
      const newMap: Map<number, number> = new Map();
      const update = (num, blinked) => {
        const startTotal = newMap.get(blinked) ?? 0;
        newMap.set(blinked, startTotal + blinkMap.get(num));
      };

      for (const num of blinkMap.keys()) {
        const blinked = this.transform(num);
        if (Array.isArray(blinked)) {
          update(num, blinked[0]);
          update(num, blinked[1]);
        } else {
          update(num, blinked);
        }
      }
      blinkMap = newMap;
    }

    return blinkMap;
  }

  get totalAfterLotsOfBlinks(): number {
    let sum = 0;
    for (const count of this.memoizedCountAfterBlinks(
      this.initial,
      75
    ).values()) {
      sum += count;
    }
    return sum;
  }

  setSolution(): void {
    this.solutions["totalAfterBlinks"] = this.totalAfterBlinks;
  }
}
