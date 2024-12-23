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
    /*
     *
    the brute force method of blinking the entire array 75 times or
    even blinking 75 times with the improvement of calulating zeroPath
    will take forever (and run out of memory well before finishing).
    but since it doesn't matter what order the numbers are in, we can
    instead just keep track of how many occurences of each number
    are in the array at a given step. then, on the next step, blink
    that number once, and set the number of occurrences of the blink
    number(s) for the subsequence step.
    e.g. numbers at step 0: [125, 17]
    the occurrence map at step 0 is Map({ 125: 1, 17: 1 })
    we apply blink to the keys of map at step 1 and copy the value over
    to build map at step 1: Map({ 253000: 1, 1: 1, 17: 1 })
    as we iterate, we can have two keys in our prev. step map blink
    to the same number, so we need to either set a new entry in the map
    or add to an existing entry
    *
    */

    let blinkMap: Map<number, number> = new Map();

    for (const num of numbers) {
      blinkMap.set(num, 1);
    }

    for (let i = 1; i <= times; i++) {
      const newMap: Map<number, number> = new Map();
      const update = (num: number, blinked: number) => {
        const startTotal = newMap.get(blinked) ?? 0;
        const newTotal = blinkMap.get(num) ?? 0;
        newMap.set(blinked, startTotal + newTotal);
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
    this.solutions["totalAfterLotsOfBlinks"] = this.totalAfterBlinks;
  }
}
