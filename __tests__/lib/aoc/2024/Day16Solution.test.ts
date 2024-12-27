import Day16Solution from "@lib/aoc/2024/Day16Solution";

const input = `###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`;

/*
 *     012345678901234
 * 0   ###############
 * 1   #.......#....E#
 * 2   #.#.###.#.###.#
 * 3   #.....#.#...#.#
 * 4   #.###.#####.#.#
 * 5   #.#.#.......#.#
 * 6   #.#.#####.###.#
 * 7   #...........#.#
 * 8   ###.#.#####.#.#
 * 9   #...#.....#.#.#
 * 10  #.#.#.###.#.#.#
 * 11  #.....#...#.#.#
 * 12  #.###.#.#.#.#.#
 * 13  #S..#.....#...#
 * 14  ###############
 * */

const input2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;

describe("Day 16 Solution", () => {
  let s: Day16Solution;

  beforeEach(() => {
    s = new Day16Solution(input);
  });

  it("should have DAY === 16", () => {
    expect(s.DAY).toBe(16);
  });

  it("should have weighted graph G", () => {
    const vertex = "(7,5,E)";
    const weights = s.G.getWeights(vertex);
    expect(weights).toBeInstanceOf(Map);
    expect(weights.get("(7,6,E)")).toBe(1);
    expect(weights.get("(8,5,S)")).toBe(1001);

    // dead ends
    const deadends = ["(3,7,S)", "(5,3,N)", "(13,3,E)"];
    for (const deadend of deadends) {
      const weights = s.G.getWeights(deadend);
      expect(weights).toBeInstanceOf(Map);
      expect(weights.size).toBe(0);
    }
  });

  it("should do Dijkstra's algorithm at start point", () => {
    expect(s.minWeight()).toBe(7036);

    const s2: Day16Solution = new Day16Solution(input2);
    expect(s2.minWeight("S")).toBe(11048);

    // const l: Day16Solution = new Day16Solution(liveInput);
    // l.log(l.start);
    // const d = l.G.Dijkstra("(139,1,S)");
    // l.log(d);
    // l.log(l.minWeight("S")); // 126548
    // l.log(l.minWeight("W")); // 115500, winner.
  });
});
