import Day17Solution from "@lib/aoc/2024/Day17Solution";

const input = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`;

const input2 = `Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`;

describe("Day 17 Solution", () => {
  let s: Day17Solution;

  beforeEach(() => {
    s = new Day17Solution(input);
  });

  it("should have DAY === 17", () => {
    expect(s.DAY).toBe(17);
  });

  it("should have registers corresponding to input", () => {
    expect(s.A).toBe(729);
    expect(s.B).toBe(0);
    expect(s.C).toBe(0);
  });

  it("should have getters and setters for each register", () => {
    expect(s.A).toBe(729);
    s.A = 123;
    expect(s.A).toBe(123);

    expect(s.B).toBe(0);
    s.B = 456;
    expect(s.B).toBe(456);

    expect(s.C).toBe(0);
    s.C = 789;
    expect(s.C).toBe(789);
  });

  it("should have getter for current opcode", () => {
    expect(s.opcode).toBe("0");
  });

  it("should have getter for current operand", () => {
    expect(s.operand).toBe("1");
  });

  it("should have getter for current operand literal", () => {
    expect(s.operandLiteral).toBe(1);
  });

  it("should have getter for current operand combo", () => {
    expect(s.operandCombo).toBe(1);
    s.pointer = 1;
    expect(s.operandCombo).toBe(s.B);
    s.pointer = 2;
    expect(s.operandCombo).toBe(s.A);

    const error = (): number => {
      s.pointer = 5;
      return s.operandCombo;
    };

    expect(error).toThrow(Error);
  });

  it("should have adv method that writes 2 / 2**operandCombo to register A", () => {
    // current pointer = 0, operand = "1", operandCombo = 1, register A = 729
    // expected A = Math.floor(729 / 2**1) = Math.floor(364.5) = 364
    s.adv();
    expect(s.A).toBe(364);
    expect(s.pointer).toBe(2);
  });

  it("should have bxl method that write the value of register B XOR operandLiteral to register B", () => {
    // current pointer = 0, operand = "1", operandLiteral = 1, register B = 0
    // expected B = 0 ^ 1 = 1
    s.bxl();
    expect(s.B).toBe(1);
    expect(s.pointer).toBe(2);
    s.B = 14;
    s.pointer = 1;
    // expected B = 14 ^ 5 = 11
    s.bxl();
    expect(s.B).toBe(11);
  });

  it("should have method bst that writes the value of operandCombo modulo 8 to register B", () => {
    // current pointer = 0, operandCombo = 1
    // expected B = 1 mod 8 = 1
    s.bst();
    expect(s.B).toBe(1);
    expect(s.pointer).toBe(2);
  });

  it("should have method jnz that advances the pointer to the value of operandLiteral if register A is not 0", () => {
    // current pointer = 0, operandLiteral = 1, register A = 729
    // expected pointer = 1
    s.jnz();
    expect(s.pointer).toBe(1);
    s.A = 0;
    // A = 0, pointer should advance as normal from 1 -> 3
    s.jnz();
    expect(s.pointer).toBe(3);
  });

  it("should have method bxc that writes the value of register B XOR register C to register B", () => {
    // current pointer = 0, register B = 0, register C = 0
    // expected B = 0 ^ 0 = 0
    s.bxc();
    expect(s.B).toBe(0);
    expect(s.pointer).toBe(2);
    s.B = 14;
    s.C = 5;
    // expected B = 14 ^ 5 = 11
    s.bxc();
    expect(s.B).toBe(11);
    expect(s.pointer).toBe(4);
  });

  it("should have method out that returns the value of operandCombo modulo 8", () => {
    // current pointer = 0, operandCombo = 1, expected output = 1
    expect(s.out()).toBe(1);
    expect(s.pointer).toBe(2);
    expect(s.out()).toBe(1); // 729 mod 8 = 1
    expect(s.pointer).toBe(4);
  });

  it("should have method bdv that writes the value of register A divided by 2**operandCombo to register B", () => {
    // current pointer = 0, operandCombo = 1, register A = 729
    // expected B = 729 / 2**1 = 364.5 = 364
    s.bdv();
    expect(s.B).toBe(364);
    expect(s.pointer).toBe(2);
  });

  it("should have method cdv that writes the value of register A divided by 2**operandCombo to register C", () => {
    // current pointer = 0, operandCombo = 1, register A = 729
    // expected B = 729 / 2**1 = 364.5 = 364
    s.cdv();
    expect(s.C).toBe(364);
    expect(s.pointer).toBe(2);
  });

  it("should have generic exec method that executes the instruction associated with the current opcode, returns the value of the instruction if any, and updating registers and pointer as necessary", () => {
    // current pointer = 0, opcode = "0", OPS["0"] = adv, expect no output, A = 364, pointer = 2
    const output: number | undefined = s.exec();
    expect(output).toBeUndefined();
    expect(s.A).toBe(364);
    expect(s.pointer).toBe(2);

    // current pointer = 2, opcode = "5", operandCombo = s.A = 364, OPS["5"] = out
    // expected output = 364 mod 8 = 4, expected pointer = 4
    const output2: number | undefined = s.exec();
    expect(output2).toBe(4);
    expect(s.pointer).toBe(4);

    // current pointer = 4, opcode = "3", s.A = 364 != 0, operandLiteral = 0, OPS["3"] = jnz
    // expected pointer = 0
    const output3: number | undefined = s.exec();
    expect(output3).toBeUndefined();
    expect(s.pointer).toBe(0);
  });

  it("should have accessor HALT that returns true if the pointer has reached the end of the instructions", () => {
    expect(s.HALT).toBe(false);
    s.pointer = s.instructions.length;
    expect(s.HALT).toBe(true);
  });

  it("should have method runProgram that runs each instruction according to current pointer, keeping track of comma-separated outputs, returning the final output once the program halts", () => {
    const output = s.runProgram();
    expect(output).toBe("4,6,3,5,6,3,5,2,1,0");

    // const l: Day17Solution = new Day17Solution(liveInput);
    // l.log(l.runProgram()); // 6,5,7,4,5,7,3,1,0
  });

  it("should run a", () => {
    const s2: Day17Solution = new Day17Solution(input2);
    const result = s2.betterProgram();
    expect(result).toBe(117440);

    // const l: Day17Solution = new Day17Solution(liveInput);
    // l.log(l.betterProgram()); // 105875099912602
  });
});
