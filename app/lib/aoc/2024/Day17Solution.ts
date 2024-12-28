import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Queue from "@lib/aoc/Queue";

export default class Day17Solution extends SolutionBuilder {
  Registers: {
    A: number;
    B: number;
    C: number;
  };
  instructions: string[];
  pointer: number;

  constructor(input: string) {
    super(17, input);
    this.initialize();
  }

  initialize(): void {
    this.Registers = { A: 0, B: 0, C: 0 };
    this.pointer = 0;

    const regA = this.input.split("\n")[0].split(": ")[1];
    const regB = this.input.split("\n")[1].split(": ")[1];
    const regC = this.input.split("\n")[2].split(": ")[1];

    this.Registers.A = Number(regA);
    this.Registers.B = Number(regB);
    this.Registers.C = Number(regC);

    this.instructions = this.input.split("\n")[4].split(": ")[1].split(",");
  }

  get A(): number {
    return this.Registers.A;
  }

  get B(): number {
    return this.Registers.B;
  }

  get C(): number {
    return this.Registers.C;
  }

  set A(value: number) {
    this.Registers.A = value;
  }

  set B(value: number) {
    this.Registers.B = value;
  }

  set C(value: number) {
    this.Registers.C = value;
  }

  get opcode(): string {
    return this.instructions[this.pointer];
  }

  get operand(): string {
    return this.instructions[this.pointer + 1];
  }

  get operandLiteral(): number {
    return Number(this.operand);
  }

  get operandCombo(): number {
    const num = this.operandLiteral;
    if (num < 4) return num;
    if (num === 4) return this.A;
    if (num === 5) return this.B;
    if (num === 6) return this.C;
    throw new Error("invalid operand");
  }

  advancePointer(): void {
    this.pointer += 2;
  }

  adv = (): void => {
    const A = this.A;
    const op = this.operandCombo;
    this.A = Math.floor(A / 2 ** op);
    this.advancePointer();
  };

  bxl = (): void => {
    const B = this.B;
    const op = this.operandLiteral;
    this.B = B ^ op;
    this.advancePointer();
  };

  bst = (): void => {
    this.B = this.mod(this.operandCombo, 8);
    this.advancePointer();
  };

  jnz = (): void => {
    if (this.A === 0) {
      this.advancePointer();
      return;
    }
    this.pointer = this.operandLiteral;
  };

  bxc = (): void => {
    this.B = this.B ^ this.C;
    this.advancePointer();
  };

  out = (): number => {
    const output = this.mod(this.operandCombo, 8);
    this.advancePointer();
    return output;
  };

  bdv = (): void => {
    const A = this.A;
    const op = this.operandCombo;
    this.B = Math.floor(A / 2 ** op);
    this.advancePointer();
  };

  cdv = (): void => {
    const A = this.A;
    const op = this.operandCombo;
    this.C = Math.floor(A / 2 ** op);
    this.advancePointer();
  };

  exec = (): undefined | number => {
    const OPS = {
      "0": this.adv,
      "1": this.bxl,
      "2": this.bst,
      "3": this.jnz,
      "4": this.bxc,
      "5": this.out,
      "6": this.bdv,
      "7": this.cdv,
    };

    return OPS[this.opcode]();
  };

  get HALT(): boolean {
    return this.pointer >= this.instructions.length;
  }

  runProgram(): string {
    let output = "";
    while (!this.HALT) {
      let result: string | number | undefined = this.exec();
      if (result !== undefined) {
        if (output.length > 0) {
          result = `,${result}`;
        }
        output = `${output}${result}`;
      }
    }

    return output;
  }

  // part 2
  betterProgram(): number {
    let output: number = 0;
    const Q: Queue = new Queue();
    Q.enqueue({ result: "", len: 0 });

    while (!Q.isEmpty()) {
      const current = Q.dequeue();
      // this.log(current);
      const { result, len, A } = current;

      if (len === this.instructions.length) {
        output = A;
        break;
      }

      const from = parseInt(result + "000", 2);
      const to = parseInt(result + "111", 2);
      const expect = this.instructions
        .map(Number)
        .slice((len + 1) * -1)
        .join(",");

      // this.log(`from: ${from}, to: ${to}, expect: ${expect}`);
      for (let a = from; a <= to; a++) {
        this.initialize();
        this.A = a;
        const r = this.runProgram();
        if (r === expect) {
          const next = {
            result: a.toString(2),
            len: len + 1,
            A: parseInt(a.toString(2), 2),
          };
          Q.enqueue(next);
        }
      }
    }
    return output;
  }
}
