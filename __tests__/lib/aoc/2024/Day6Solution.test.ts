import Day6Solution from "@solutions/2024/Day6Solution";
import Matrix from "@solutions/Matrix";

/**
 * @jest-environment jsdom
 */

describe("Day 6 Solution", () => {
  let solution: Day6Solution;

  beforeEach(() => {
    const input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
    solution = new Day6Solution(input);
  });

  it("should have DAY == 6", () => {
    expect(solution.DAY).toBe(6);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
  });

  it("should have an initial matrix", () => {
    expect(solution.initial).toBeInstanceOf(Matrix);
  });

  it("should have an accessor method guardPosition that returns the position of the guard in the matrix", () => {
    expect(solution.guardPosition).toEqual([6, 4]);

    const junk = new Day6Solution(".....\n.....\n.....\n.....\n.....");
    expect(() => junk.guardPosition).toThrow(Error);
  });

  it("should have an accessor method guardDirection that returns the direction the guard is facing", () => {
    expect(solution.guardDirection).toBe(Matrix.DIRECTIONS.N);
  });

  it("should have a method guardTraversal that takes a matrix and returns the matrix with the guard's path and a boolean if it creates an infinite guard loop", () => {
    const complete: string = `....#.....
....XXXXX#
....X...X.
..#.X...X.
..XXXXX#X.
..X.X.X.X.
.#XXXXXXX.
.XXXXXXX#.
#XXXXXXX..
......#X..`;
    const traversed: Matrix = solution.guardTraversal();

    expect(traversed.toString()).toEqual(complete);
  });

  it("should have an accessor method visitedCount that returns the number of visited entries", () => {
    expect(solution.visitedCount).toBe(41);
  });

  it("should have a method checkForGuardLoop that takes a possible obstruction location and returns a boolean to indicate if that added obstruction would induce an infinite traversal loop", () => {
    expect(solution.checkForGuardLoop([0, 0])).toBe(false);
    expect(solution.checkForGuardLoop([6, 3])).toBe(true);
  });

  it("should have an accessor countGuardLoops that returns the number of positions an obstruction can be placed that induce a guard loop", () => {
    expect(solution.countGuardLoops).toBe(6);
  });
});
