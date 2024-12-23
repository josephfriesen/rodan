import Day11Solution from "@lib/aoc/2024/Day11Solution";

describe("Day 11 Solution", () => {
  let solution: Day11Solution;

  beforeEach(() => {
    solution = new Day11Solution("125 17");
  });

  it("should have DAY === 11", () => {
    expect(solution.DAY).toBe(11);
  });

  it("blinks", () => {
    expect(solution.blink([125, 17])).toEqual([253000, 1, 7]);
    expect(solution.blink([253000, 1, 7])).toEqual([253, 0, 2024, 14168]);
  });

  it("has a zeroPath", () => {
    expect(solution.zeroPath).toBeDefined();
  });

  it("counts numbers remaining after n blinks", () => {
    expect(solution.countNumbersAfterBlinks([125, 17], 6)).toBe(22);
    expect(solution.countNumbersAfterBlinks([125, 17], 25)).toBe(55312);
  });

  it("has accessor 'totalAfterBlinks' that counts the total numbers remaining after applying 25 blinks", () => {
    expect(solution.totalAfterBlinks).toBe(55312);
  });

  it("totalAfterLotsOfBlinks", () => {
    expect(solution.totalAfterLotsOfBlinks).toBe(65601038650482);
  });
});
