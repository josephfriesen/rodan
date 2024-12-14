import Day3Solution from "@solutions/2024/Day3Solution";

const input = `mul(2,3)m*ul(2,3)how(2,3)mul(4,1s2),almul(2,3)mul(2,,3)asdfbaksmul(1,5)db0892`;
const conditionalInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;

const solution = new Day3Solution(input);
const conditionalSolution = new Day3Solution(conditionalInput);

describe("Day 3 Solution", () => {
  it("should have DAY == 3", () => {
    expect(solution.DAY).toBe(3);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
    expect(solution.input).toBe(input);
  });

  it("should have products", () => {
    expect(solution.products).toBeDefined();
    expect(Array.isArray(solution.products)).toBe(true);
  });

  it("should have instructions", () => {
    expect(solution.instructions).toBeDefined();
    expect(Array.isArray(solution.instructions)).toBe(true);
  });

  it("should have instructedProducts", () => {
    expect(solution.instructedProducts).toBeDefined();
    expect(Array.isArray(solution.instructedProducts)).toBe(true);
  });

  it("should parse input to array of arrays, only accepting valid mul(x,y) entries", () => {
    expect(solution.products).toBeDefined();
    expect(Array.isArray(solution.products)).toBe(true);
    expect(solution.products.length).toBe(3);
    expect(solution.products[0]).toEqual([2, 3]);
    expect(solution.products[1]).toEqual([2, 3]);
    expect(solution.products[2]).toEqual([1, 5]);
  });

  it("should parse input to array of instructions", () => {
    expect(conditionalSolution.instructions.length).toBe(6);
    expect(conditionalSolution.instructions[0]).toBe("mul(2,4)");
    expect(conditionalSolution.instructions[1]).toBe("don't()");
    expect(conditionalSolution.instructions[2]).toBe("mul(5,5)");
    expect(conditionalSolution.instructions[3]).toBe("mul(11,8)");
    expect(conditionalSolution.instructions[4]).toBe("do()");
    expect(conditionalSolution.instructions[5]).toBe("mul(8,5)");
  });

  it("should parse its list of instructions to a filtered list of instructedProducts", () => {
    expect(conditionalSolution.instructedProducts.length).toBe(2);
    expect(conditionalSolution.instructedProducts[0]).toEqual([2, 4]);
    expect(conditionalSolution.instructedProducts[1]).toEqual([8, 5]);
  });

  it("should have mulToNumbers that takes a string of form 'mul(x,y)' and returns an array of numbers [x,y]", () => {
    expect(solution.mulToNumbers).toBeDefined();
    expect(solution.mulToNumbers("mul(2,3)")).toEqual([2, 3]);
  });

  it("should have calculateProduct private method that multiplies two numbers", () => {
    expect(solution.calculateProduct).toBeDefined();
    expect(solution.calculateProduct([2, 3])).toBe(6);
    expect(solution.calculateProduct([1, 5])).toBe(5);
    expect(solution.calculateProduct(solution.products[0])).toEqual(6);
  });

  it("should have sumOfProducts getter that sums all products", () => {
    expect(solution.sumOfProducts).toBeDefined();
    expect(solution.sumOfProducts).toBe(17);
  });

  it("should have sumOfInstructedProducts getter that sums all instructedProducts", () => {
    expect(conditionalSolution.sumOfInstructedProducts).toBeDefined();
    expect(conditionalSolution.sumOfInstructedProducts).toBe(48);
  });
});
