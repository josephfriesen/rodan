import { SolutionBuilder } from "../SolutionBuilder";
import { create, all } from "mathjs";

type InstructionType = { x: number; y: number };
type SolutionType = { A: number; B: number };
export interface ClawPuzzle {
  A: InstructionType;
  B: InstructionType;
  P: InstructionType;
  solution?: SolutionType;
  tokens?: number;
  valid?: boolean;
}

export default class Day13Solution extends SolutionBuilder {
  ClawPuzzles: ClawPuzzle[];
  BigClawPuzzles: ClawPuzzle[];
  math: any;
  bigMath: any;

  constructor(input: string) {
    super(13, input);
    this.instantiateMath();
    this.parseInput();
    this.makeBigPuzzles();
  }

  private instantiateMath(): void {
    this.math = create(all);
    this.bigMath = create(all, { number: "Fraction" });
  }

  private parseInput(): void {
    this.ClawPuzzles = [];
    const getNumbers = (i: string): [number, number] => {
      const matches = i.match(/([0-9]+)/g);
      if (!matches || matches.length !== 2) {
        console.error(matches);
        throw new Error("input string parse error");
      }
      return [Number(matches[0]), Number(matches[1])];
    };

    const puzzleInputs: string[] = this.input.split(/\n\s*\n/);
    puzzleInputs.forEach((block) => {
      const [buttonA, buttonB, prize] = block.split("\n");
      const A = { x: getNumbers(buttonA)[0], y: getNumbers(buttonA)[1] };
      const B = { x: getNumbers(buttonB)[0], y: getNumbers(buttonB)[1] };
      const P = { x: getNumbers(prize)[0], y: getNumbers(prize)[1] };
      this.ClawPuzzles.push(this.solvePuzzle({ A, B, P }));
    });
  }

  private makeBigPuzzles(): void {
    this.BigClawPuzzles = this.ClawPuzzles.map((p: ClawPuzzle) => {
      const inputPuzzle: ClawPuzzle = {
        A: p.A,
        B: p.B,
        P: { x: p.P.x + 10000000000000, y: p.P.y + 10000000000000 },
      };
      return this.solveBigPuzzle(inputPuzzle);
    });
  }

  solvePuzzle(puzzle: ClawPuzzle): ClawPuzzle {
    const { A, B, P } = puzzle;
    const m: Array<[number, number]> = [
      [A.x, B.x],
      [A.y, B.y],
    ];
    const b: [number, number] = [P.x, P.y];
    const linsolve: [[number], [number]] = this.math
      .lusolve(this.math.lup(m), b)
      .toArray();
    const [solutionA, solutionB]: [number, number] = linsolve.map(
      (a: [number]) => {
        const [n] = a;
        const formatted = this.math.format(n, { precision: 6 });
        return Number(formatted);
      }
    ) as [number, number];

    const solution: SolutionType = {
      A: solutionA,
      B: solutionB,
    };

    const valid: boolean =
      this.math.isInteger(solution.A) && this.math.isInteger(solution.B);

    const tokens = valid ? solution.A * 3 + solution.B : undefined;
    return { ...puzzle, solution, valid, tokens };
  }

  solveBigPuzzle(puzzle: ClawPuzzle): ClawPuzzle {
    const { A, B, P } = puzzle;
    const m: Array<[number, number]> = [
      [A.x, B.x],
      [A.y, B.y],
    ];
    const b: [number, number] = [P.x, P.y];
    const linsolve: [[number], [number]] = this.bigMath
      .lusolve(this.bigMath.lup(m), b)
      .toArray();
    const [solutionA, solutionB]: [number, number] = linsolve.map(
      (a: [number]) => {
        const [n] = a;
        const formatted = this.bigMath.format(n, { precision: 15 });
        return Number(formatted);
      }
    ) as [number, number];

    const solution: SolutionType = {
      A: solutionA,
      B: solutionB,
    };

    const valid: boolean =
      this.bigMath.isInteger(solution.A) && this.bigMath.isInteger(solution.B);

    const tokens = valid ? solution.A * 3 + solution.B : undefined;
    return { ...puzzle, solution, valid, tokens };
  }

  get tokensSpent(): number {
    return this.ClawPuzzles.reduce((acc, curr) => {
      if (curr.valid && curr.tokens) {
        return acc + curr.tokens;
      }
      return acc;
    }, 0);
  }

  get tokensSpentOnBigClawGames(): number {
    return this.BigClawPuzzles.reduce((acc, curr) => {
      if (curr.valid && curr.tokens) {
        return acc + curr.tokens;
      }
      return acc;
    }, 0);
  }
}
