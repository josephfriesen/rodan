import Day16Solution from "@lib/aoc/2024/Day16Solution";
import DirectedGraph from "@lib/aoc/DirectedGraph";

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

  it("should have a graph H in which all edges of G are reversed", () => {
    expect(s.H).toBeInstanceOf(DirectedGraph);
    const test: string = "(7,3,N)";
    expect(s.G.getNode(test)?.values()).toBeDefined();
    for (const node of s.G.getNode(test)?.values()) {
      expect(s.H.getNode(test)?.has(node)).toBe(false);
      expect(s.H.getNode(node)?.has(test)).toBe(true);
    }

    const randomNode = [...s.G.getNodes().keys()][
      Math.floor(Math.random() * s.G.getNodes().size)
    ];
    expect(s.G.getNode(randomNode)?.values()).toBeDefined();
    for (const node of s.G.getNode(randomNode)?.values()) {
      expect(s.H.getNode(randomNode)?.has(node)).toBe(false);
      expect(s.H.getNode(node)?.has(randomNode)).toBe(true);
    }
  });

  it("should build a set of optimal seats, vertices of G that lie on a minimal-weight path from start to end", () => {
    const optimalSeats: Set<string> = s.optimalSeats();
    // s.printOptimalSeats();
    expect(optimalSeats.size).toEqual(45);

    // const l: Day16Solution = new Day16Solution(liveInput);
    // l.printOptimalSeats("W"); // 679, winner
  });
});
