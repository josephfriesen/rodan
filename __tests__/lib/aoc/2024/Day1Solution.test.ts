import Day1Solution from "@solutions/2024/Day1Solution";

const input = `63721   98916
83871   23584
55026   62690
21948   69139
11201   33499
96077   62705
41231   87261
71203   13285
53280   86974
31172   11658`;

const sortedLeft = [
  63721, 83871, 55026, 21948, 11201, 96077, 41231, 71203, 53280, 31172,
]
  .sort()
  .reverse();
const sortedRight = [
  98916, 23584, 62690, 69139, 33499, 62705, 87261, 13285, 86974, 11658,
]
  .sort()
  .reverse();
const distances = sortedLeft.map((num, i) => Math.abs(num - sortedRight[i]));

const solution = new Day1Solution(input);

describe("Day 1 Solution", () => {
  it("should know that 1 equals 1", () => {
    expect(1).toBe(1);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
    expect(solution.input).toBe(input);
  });

  it("should have DAY == 1", () => {
    expect(solution.DAY).toBe(1);
  });

  it("should have sortedListLeft", () => {
    expect(solution.sortedListLeft).toBeDefined();
    expect(solution.sortedListLeft.length).toBe(10);
    for (const num of solution.sortedListLeft) {
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it("should have sortedListRight", () => {
    expect(solution.sortedListRight).toBeDefined();
    expect(solution.sortedListRight.length).toBe(10);
    for (const num of solution.sortedListRight) {
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it("should have distances", () => {
    expect(solution.distances).toBeDefined();
    expect(solution.distances.length).toBe(10);
    solution.distances.forEach((number, i) => {
      expect(number).toBe(distances[i]);
    });
  });

  it("should calculate total distance correctly", () => {
    expect(solution.totalDistance).toBe(68947);
  });

  it("should calculate total similarity correctly", () => {
    expect(solution.totalSimilarity).toBe(0);
  });
});
