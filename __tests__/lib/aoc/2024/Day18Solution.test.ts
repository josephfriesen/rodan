import Matrix from "@app/lib/aoc/Matrix";
import SimpleGraph from "@app/lib/aoc/SimpleGraph";
import Day18Solution from "@lib/aoc/2024/Day18Solution";

const input = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;

describe("Day 18 Solution", () => {
  let s: Day18Solution;

  beforeEach(() => {
    s = new Day18Solution(input, 7);
  });

  it("should have DAY === 18", () => {
    expect(s.DAY).toBe(18);
  });

  it("should have dimension", () => {
    expect(s.dim).toBe(7);
  });

  it("should have map with entries all '.'", () => {
    expect(s.map).toBeInstanceOf(Matrix);
    expect(s.map.entry(0, 0)).toBe(".");
  });

  it("should have method corruptedSectors that returns matrix with first n entries corrupted (= '#'", () => {
    const corrupted: Matrix = s.corruptedSectors(1);
    expect(corrupted.entry(0, 0)).toBe(".");
    expect(corrupted.entry(4, 5)).toBe("#");
  });

  it("should have undirected graph G built from map with vertices '.'-valued entires of map and edges between cardinal neighbors", () => {
    const corrupted: Matrix = s.corruptedSectors(12);
    const G: SimpleGraph = s.buildGraph(corrupted);
    expect(G).toBeInstanceOf(SimpleGraph);
    expect(G.vertexExists("[0,0]")).toBe(true);
    expect(G.vertexExists("[4,5]")).toBe(false);
    expect(G.degree("[0,0]")).toBe(2);
  });

  it("should find shortest path after corrupting the first n sectors", () => {
    expect(s.shortestPathAfterCorruption(12)).toBe(22);

    // const l: Day18Solution = new Day18Solution(liveInput, 71);
    // l.log(l.shortestPathAfterCorruption(1024)); // 416
  });

  it("should find the first sector that would disconnect the associated graph", () => {
    s.log(s.getFirstCutVertex());
    expect(s.getFirstCutVertex()).toEqual([1, 6]);

    // const l: Day18Solution = new Day18Solution(liveInput, 71);
    // l.log(l.getFirstCutVertex()); // [23, 50] (solution is backwards, [50,23])
  });
});
