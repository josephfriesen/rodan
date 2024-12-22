import Day10Solution from "@app/lib/aoc/2024/Day10Solution";
import DirectedAcyclicGraph from "@app/lib/aoc/DirectedAcyclicGraph";
import Matrix from "@app/lib/aoc/Matrix";

const input = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;

describe("Day 10 Solution", () => {
  let solution: Day10Solution;

  beforeEach(() => {
    solution = new Day10Solution(input);
  });

  it("should have DAY === 10", () => {
    expect(solution.DAY).toBe(10);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
  });

  it("should have attribute 'map' of type Matrix", () => {
    expect(solution.map).toBeInstanceOf(Matrix);
  });

  it("should have attribute 'graph' of type DirectedAcyclicGraph", () => {
    expect(solution.graph).toBeInstanceOf(DirectedAcyclicGraph);
  });

  it("should have attribute 'trailheads', an array of strings that give the vertices of 'graph' corresponding to the entries of the matrix of elevation 0", () => {
    expect(solution.trailheads).toEqual([
      "[0,2]",
      "[0,4]",
      "[2,4]",
      "[4,6]",
      "[5,2]",
      "[5,5]",
      "[6,0]",
      "[6,6]",
      "[7,1]",
    ]);
  });

  it("should have attribute 'trailtails', an array of strings that give the vertices of 'graph' corresponding to the entries of the matrix of elevation 9", () => {
    expect(solution.trailtails).toEqual([
      "[0,1]",
      "[2,5]",
      "[3,0]",
      "[3,4]",
      "[4,5]",
      "[5,4]",
      "[6,4]",
    ]);
  });

  it("should have attribute 'validPaths', which give the number of reachable trailtails for each trailhead", () => {
    expect(solution.validPaths).toBeInstanceOf(Map);
    expect(solution.validPaths.get("[0,2]")).toBe(5);
  });

  it("should have an accessor 'sumOfValidPaths' that sums the number of valid paths for each source node", () => {
    expect(solution.validPathsSum).toBe(36);
  });

  it("should have attribute 'pathRatings' that gives the path rating for each trailhead", () => {
    expect(solution.pathRatings).toBeInstanceOf(Map);
    expect(solution.pathRatings.get("[0,2]")).toBe(20);
  });

  it("should have an accessor 'pathRatingsSum' that sums the path ratings of all trailheads", () => {
    expect(solution.pathRatingsSum).toBe(81);
  });
});
