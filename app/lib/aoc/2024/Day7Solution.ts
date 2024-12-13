import { SolutionBuilder } from '@lib/aoc/SolutionBuilder';
import Queue from '@lib/aoc/Queue';

type BinaryOperation = (m: number, n: number) => number;
type Calibration = { goal: number; inputs: Array<number>; operations: number };

class Day7Solution extends SolutionBuilder {
  calibrations: Array<Calibration> = [];

  constructor(input) {
    super(7, input);
    this.inputToCalibrations();
  }

  private inputToCalibrations(): void {
    const lines: Array<string> = this.input.split('\n').filter(Boolean);
    for (const line of lines) {
      const [goalString, inputsString] = line.split(': ');
      const goal = Number(goalString);
      const inputs = inputsString.split(' ').map((s) => Number(s));
      const operations = inputs.length - 1;
      const calibration: Calibration = { goal, inputs, operations };
      this.calibrations.push(calibration);
    }
  }

  static ADD = (m: number, n: number): number => {
    return m + n;
  };
  static MULT = (m: number, n: number): number => {
    return m * n;
  };
  static CONCAT = (m: number, n: number): number => {
    return Number(`${m}${n}`);
  };

  // given binary string, return one of ADD, MULT, or CONCAT
  // where string[i] = 0 => operations[i] = ADD
  // string[i] = 1 => operations[i] = MULT
  // string[i] = 2 => operations[i] = CONCAT
  binaryOperations(s: string): Array<BinaryOperation> {
    const OP = [Day7Solution.ADD, Day7Solution.MULT, Day7Solution.CONCAT];

    return s.split('').map((bit: string) => {
      return OP[Number(bit)];
    });
  }

  binaryStrings(n: number): Array<string> {
    if (n < 0) {
      throw new TypeError(
        'Expected non-negative integer n, how can you have a negative-length string come on bozo.',
      );
    }

    const strings: Array<string> = [];

    const generate = (string: string = ''): void => {
      if (string.length === n) {
        strings.push(string);
      } else {
        generate(string + '0');
        generate(string + '1');
      }
    };
    generate();

    return strings;
  }

  ternaryStrings(n: number): Array<string> {
    if (n < 0) {
      throw new TypeError('negative length strings not allowed, bozo.');
    }

    const strings: Array<string> = [];

    const generate = (string: string = ''): void => {
      if (string.length === n) {
        strings.push(string);
      } else {
        generate(string + '0');
        generate(string + '1');
        generate(string + '2');
      }
    };
    generate();

    return strings;
  }

  generateQueue(arr: Array<string | number | BinaryOperation>): Queue {
    const queue = new Queue();
    for (const el of arr) {
      queue.enqueue(el);
    }
    return queue;
  }

  checkCalibrationValidity(
    c: Calibration,
    stringBuilder: (n: number) => Array<string> = this.binaryStrings,
  ): boolean {
    const { goal, inputs, operations } = c;

    const strings: Array<string> = stringBuilder(operations);

    for (const string of strings) {
      const inputQueue: Queue = this.generateQueue(c.inputs);
      let total: number = inputQueue.dequeue();
      const operationQueue: Queue = this.generateQueue(
        this.binaryOperations(string),
      );

      while (!inputQueue.isEmpty()) {
        const nextInput: number = inputQueue.dequeue();
        const nextOperation: BinaryOperation = operationQueue.dequeue();
        total = nextOperation(total, nextInput);
        if (total > goal) {
          break;
        }
      }

      if (total === goal) {
        return true;
      }
    }

    return false;
  }

  get validCalibrationsSum(): number {
    return this.calibrations.reduce((acc, calibration) => {
      if (this.checkCalibrationValidity(calibration, this.binaryStrings)) {
        return acc + calibration.goal;
      }
      return acc;
    }, 0);
  }

  get validCalibrationsWithConcatSum(): number {
    return this.calibrations.reduce((acc, calibration) => {
      if (this.checkCalibrationValidity(calibration, this.ternaryStrings)) {
        return acc + calibration.goal;
      }
      return acc;
    }, 0);
  }
}

export default Day7Solution;
