import Day19Solution from "@lib/aoc/2024/Day19Solution";

const input = `r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`;

describe("Day 19 Solution", () => {
  let s: Day19Solution;
  beforeEach(() => {
    s = new Day19Solution(input);
  });

  it("should have DAY === 19", () => {
    expect(s.DAY).toBe(19);
  });

  it("should have Patterns, array of strings", () => {
    expect(s.Patterns[0]).toBe("r");
    expect(s.Patterns.length).toBe(8);
  });

  it("should have Designs, array of strings", () => {
    expect(s.Designs[0]).toBe("brwrr");
    expect(s.Designs.length).toBe(8);
  });

  it("should have method testPattern that checks if a design begins with the pattern string", () => {
    expect(s.testPattern(s.Patterns[0], s.Designs[0])).toBe(false);
    expect(s.testPattern(s.Patterns[7], s.Designs[0])).toBe(true);
  });

  it("should have method buildable that gives a valid set of patterns that make the design, or false if pattern can't be built", () => {
    expect(s.buildable(s.Designs[0])).toBe(true);
    expect(s.buildable(s.Designs[1])).toBe(true);
    expect(s.buildable(s.Designs[2])).toBe(true);
    expect(s.buildable(s.Designs[3])).toBe(true);
    expect(s.buildable(s.Designs[4])).toBe(false);
    expect(s.buildable(s.Designs[5])).toBe(true);
    expect(s.buildable(s.Designs[6])).toBe(true);
    expect(s.buildable(s.Designs[7])).toBe(false);
  });

  it("should count the number of designs that are buildable from patterns", () => {
    expect(s.countBuildableDesigns).toBe(6);

    // const l: Day19Solution = new Day19Solution(liveInput);
    // l.log(l.countBuildableDesigns); // 228, winner
  });

  it("should count the number of distinct ways of building a design", () => {
    expect(s.designCombinations("gbbr")).toBe(4);
  });

  it("should count the total combinations for all designs", () => {
    expect(s.totalCombinations).toBe(16);

    // const l: Day19Solution = new Day19Solution(liveInput);
    // l.log(l.totalCombinations); // 584553405070389, winner
  });
});
