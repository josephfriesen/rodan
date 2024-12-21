import Day5Solution from "@lib/aoc/2024/Day5Solution";
import DirectedGraph from "@lib/aoc/DirectedGraph";

const input = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;

const solution = new Day5Solution(input);

describe("Day 5 Solution", () => {
  it("should have DAY == 5", () => {
    expect(solution.DAY).toBe(5);
  });

  it("should have a graph, with nodes and edges from input", () => {
    expect(solution.graph).toBeInstanceOf(DirectedGraph);
    expect(solution.graph.getNodes().size).toBe(7);
    expect(solution.graph.getDegree("53")).toBe(4);
  });

  it("should have an array of updates", () => {
    expect(solution.updates).toBeDefined();
    expect(Array.isArray(solution.updates)).toBe(true);
    expect(solution.updates.length).toBe(6);
    expect(solution.updates[0]).toEqual(["75", "47", "61", "53", "29"]);
    expect(solution.updates[1]).toEqual(["97", "61", "53", "29", "13"]);
  });

  it("should have a isValidUpdate method that checks if an update is valid", () => {
    expect(solution.isValidUpdate).toBeDefined();
    expect(solution.isValidUpdate(["75", "47", "61", "53", "29"])).toBe(true);
    expect(solution.isValidUpdate(["97", "61", "53", "29", "13"])).toBe(true);
    expect(solution.isValidUpdate(["75", "29", "13"])).toBe(true);
    expect(solution.isValidUpdate(["75", "97", "47", "61", "53"])).toBe(false);
    expect(solution.isValidUpdate(["61", "13", "29"])).toBe(false);
    expect(solution.isValidUpdate(["97", "13", "75", "29", "47"])).toBe(false);
  });

  it("should have a getMiddlePage method that returns the middle entry of an update", () => {
    expect(solution.getMiddlePage).toBeDefined();
    expect(solution.getMiddlePage(["75", "47", "61", "53", "29"])).toBe("61");
    expect(solution.getMiddlePage(["97", "61", "53", "29", "13"])).toBe("53");
    expect(solution.getMiddlePage(["75", "29", "13"])).toBe("29");
    expect(solution.getMiddlePage(["75", "97", "47", "61", "53"])).toBe("47");
    expect(solution.getMiddlePage(["61", "13", "29"])).toBe("13");
    expect(solution.getMiddlePage(["97", "13", "75", "29", "47"])).toBe("75");
  });

  it("should sum the middle entries of all valid pages", () => {
    expect(solution.sumOfValidUpdatesPages).toBe(143);
  });

  it("should have a method correctUpdate that takes an invalid update and returns an update with a single transposition that makes it valid", () => {
    expect(solution.correctUpdate).toBeDefined();
    expect(solution.correctUpdate(["75", "97", "47", "61", "53"])).toEqual([
      "97",
      "75",
      "47",
      "61",
      "53",
    ]);
    expect(solution.correctUpdate(["61", "13", "29"])).toEqual([
      "61",
      "29",
      "13",
    ]);
    expect(solution.correctUpdate(["97", "13", "75", "29", "47"])).toEqual([
      "97",
      "75",
      "47",
      "29",
      "13",
    ]);
  });

  it("should sum the middle entries of corrected updates", () => {
    expect(solution.sumOfCorrectedUpdatesPages).toBe(123);
  });
});
