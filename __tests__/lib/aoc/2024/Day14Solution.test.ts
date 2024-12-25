import Day14Solution from "@app/lib/aoc/2024/Day14Solution";
// import Matrix from "@app/lib/aoc/Matrix";

const input = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;

describe("Day 14 Solution", () => {
  let s: Day14Solution;

  beforeEach(() => {
    s = new Day14Solution(input, 11, 7);
  });

  it("should have DAY === 14", () => {
    expect(s.DAY).toBe(14);
  });

  it("should have Robots attribute that is an array of sets consisting of starting position and vector", () => {
    expect(s.Robots[0]).toBeDefined();
    expect(s.Robots[0].initialPosition).toEqual([4, 0]);
    expect(s.Robots[0].vector).toEqual([-3, 3]);
  });

  it("should have accessor robotsBPosition that returns a Map of all current positions occupied by robots and the number of robots at that position", () => {
    const counts: Map<string, number> = s.robotsByPosition;
    expect(s.robotsByPosition).toBeDefined();
    expect(counts.get("[4,0]")).toBe(1);
    expect(counts.get("[0,3]")).toBe(2);
    expect(counts.get("[7,10]")).toBe(undefined);
  });

  it("should have moveRobot method that takes position and vector and returns the position plus the vector, adjusted for the modulus of the dimensions of the search space", () => {
    const r = s.Robots[0];
    expect(r.currentPosition).toEqual([4, 0]);
    expect(r.vector).toEqual([-3, 3]);
    expect(s.moveRobot([4, 0], [-3, 3])).toEqual([1, 3]);
    const r2 = s.Robots[8];
    expect(r2.currentPosition).toEqual([3, 9]);
    expect(r2.vector).toEqual([3, 2]);
    expect(s.moveRobot([3, 9], [3, 2])).toEqual([6, 0]);
  });

  it("should have method moveAllRobotsNSteps that updates the currentPosition of all robots after N iterations: apply moveRobot to currentPosition N times, and set currentPosition", () => {
    expect(s.moveAllRobotsNSteps).toBeDefined();
    s.moveAllRobotsNSteps(1);
    expect(s.Robots[0].currentPosition).toEqual([1, 3]);
    expect(s.Robots[8].currentPosition).toEqual([6, 0]);
    const s2: Day14Solution = new Day14Solution(input, 11, 7);
    s2.moveAllRobotsNSteps(100);
    const map: Map<string, number> = s2.robotsByPosition;
    expect(map.get("[0,6]")).toBe(2);
    expect(map.get("[0,9]")).toBe(1);
    expect(map.get("[0,0]")).toBe(undefined);
  });

  it("should have method resetRobots that returns robots to their initial positions", () => {
    s.moveAllRobotsNSteps(44);
    s.resetRobots();
    expect(s.Robots[0].currentPosition).toEqual([4, 0]);
    expect(s.Robots[8].currentPosition).toEqual([3, 9]);
  });

  it("should have accessor robotsByQuadrant to get robot counts in each quadrant", () => {
    expect(s.robotsByQuadrant).toEqual([4, 0, 2, 2]);
  });

  it("should have accessor safetyFactor that gives the product of the robotsByQuadrants", () => {
    expect(s.safetyFactor).toBe(0);
    s.resetRobots();
    s.moveAllRobotsNSteps(100);
    expect(s.safetyFactor).toBe(12);
  });
});
