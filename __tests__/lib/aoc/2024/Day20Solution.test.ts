import Matrix from "@app/lib/aoc/Matrix";
import SimpleGraph from "@app/lib/aoc/SimpleGraph";
import Day20Solution from "@lib/aoc/2024/Day20Solution";

const input = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;

describe("Day 20 Solution", () => {
  let s: Day20Solution;

  beforeEach(() => {
    s = new Day20Solution(input);
  });

  it("should have DAY === 20", () => {
    expect(s.DAY).toBe(20);
  });

  it("should have map", () => {
    expect(s.map).toBeInstanceOf(Matrix);
    expect(s.START).toEqual([3, 1]);
    expect(s.END).toEqual([7, 5]);
  });

  it("should have path graph", () => {
    expect(s.G).toBeInstanceOf(SimpleGraph);
  });

  it("should have cheatCells", () => {
    expect(s.cheatCells.length).toBe(44);
  });

  it("should have base graph consisting of the single path from start to end", () => {
    expect(s.G).toBeInstanceOf(SimpleGraph);
    expect(s.G.getVertices().length).toBe(85);
    expect(s.G.degree(s.u)).toBe(1);
    expect(s.G.degree(s.v)).toBe(1);
  });

  it("should have long, the number of steps from start to end without cheating", () => {
    expect(s.long).toBe(84);
  });

  it("should have cellScore which gives the length of the path from a cell to the end", () => {
    expect(s.cellScore([1, 11])).toBe(57);
    expect(s.cellScore(s.START)).toBe(s.long + 1);
    expect(s.cellScore([2, 1])).toBe(s.long);
    expect(s.cellScore(s.END)).toBe(1);
  });

  it("should find the steps saved from cheating at a single wall", () => {
    expect(s.cheatSavings([1, 8])).toBe(12);
    expect(s.cheatSavings([7, 10])).toBe(20);
    expect(s.cheatSavings([3, 2])).toBe(4);
  });

  it("should count the number of cells that would save steps at least a given threshold", () => {
    expect(s.countGoodCheats(100)).toBe(0);
    expect(s.countGoodCheats(20)).toBe(5);
    // const l: Day20Solution = new Day20Solution(liveInput);
    // l.log(l.countGoodCheats()); // 1365, winner
  });

  it("should calculate the cheat savings between any two points on the path", () => {
    expect(s.cheatBetweenPoints(s.START, s.END)).toBe(
      s.long - s.map.manhattanDistance(s.START, s.END)
    );
    expect(s.cheatBetweenPoints([1, 1], [13, 10])).toBe(0);
    expect(s.cheatBetweenPoints([3, 1], [3, 3])).toBe(s.cheatSavings([3, 2]));
    expect(s.cheatBetweenPoints(s.START, [7, 3])).toBe(76);
  });

  it("should count the possible cheats over a given threshold", () => {
    expect(s.countBetterCheats(50)).toBe(285);
    expect(s.countBetterCheats(76)).toBe(3);

    // const l: Day20Solution = new Day20Solution(liveInput);
    // l.log(l.countBetterCheats()); // 986082, winner
  });
});
