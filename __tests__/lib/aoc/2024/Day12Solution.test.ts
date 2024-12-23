import Day12Solution from "@lib/aoc/2024/Day12Solution";
import Matrix from "@lib/aoc/Matrix";
import SimpleGraph from "@lib/aoc/SimpleGraph";

const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

describe("Day 12 Solution", () => {
  let s: Day12Solution;

  beforeEach(() => {
    s = new Day12Solution(input);
  });

  it("should have DAY = 12", () => {
    expect(s.DAY).toBe(12);
  });

  it("should have a garden map of type Matrix", () => {
    expect(s.map).toBeInstanceOf(Matrix);
  });

  it("should have a graph with vertex set entries of map and edge {u,v} if u,v adjacent in map and entries equal", () => {
    expect(s.graph).toBeInstanceOf(SimpleGraph);
    expect(s.graph.degree("[0,0]")).toBe(2);
    expect(s.graph.order).toBe(100);
  });

  it("should have regions corresponding to the connected components of the graph", () => {
    expect(s.regions.length).toEqual(11);
    expect(s.regions.flat().length).toEqual(100);
  });

  it("should calculate a region's area", () => {
    expect(s.regionArea(s.regions[0])).toBe(12);
  });

  it("should calculate a region's permieter", () => {
    expect(s.regionPerimeter(s.regions[0])).toBe(18);
  });

  it("should calculate the cost of fencing a region", () => {
    expect(s.regionFenceCost(s.regions[0])).toBe(216);
  });

  it("should calculate the cost of fencing all discrete regions", () => {
    expect(s.totalFencingCost).toBe(1930);
  });

  it("should determine how many corners a vertex forms within its region", () => {
    // NW region R
    expect(s.corners("[0,0]")).toBe(1);
    expect(s.corners("[0,1]")).toBe(0);
    expect(s.corners("[0,2]")).toBe(0);
    expect(s.corners("[0,3]")).toBe(1);
    expect(s.corners("[1,0]")).toBe(1);
    expect(s.corners("[1,1]")).toBe(0);
    expect(s.corners("[1,2]")).toBe(1);
    expect(s.corners("[1,3]")).toBe(0);
    expect(s.corners("[2,2]")).toBe(1);
    expect(s.corners("[2,3]")).toBe(1);
    expect(s.corners("[2,4]")).toBe(2);
    expect(s.corners("[3,2]")).toBe(2);
  });

  it("should calculate the fencing perimeter with the bulk discount", () => {
    expect(s.regionBulkPerimeter(s.regions[0])).toBe(10);
  });

  it("should have accessor totalDiscountedFencingCost", () => {
    expect(s.totalDiscountedFencingCost).toBe(1206);
  });
});
