import Day9Solution from "@lib/aoc/2024/Day9Solution";

const input = "2333133121414131402";

describe("Day 9 Solution", () => {
  let solution: Day9Solution;

  beforeEach(() => {
    solution = new Day9Solution(input);
  });

  it("should have DAY == 9", () => {
    expect(solution.DAY).toBe(9);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
  });

  it("should have an attribute 'diskMap', that transforms the input string into an array of strings", () => {
    const expected: Array<string> =
      "00...111...2...333.44.5555.6666.777.888899".split("");

    expect(solution.diskMap).toEqual(expected);
  });

  it("should have an attribute 'fileSystem' which moves the file ids from right to empty spaces on the left", () => {
    const expected: Array<string> =
      "0099811188827773336446555566..............".split("");

    expect(solution.fileSystem).toEqual(expected);
  });

  it("should have an accessor 'checksum' that returns the sum of the fileSystem entries multiplied by their index", () => {
    expect(solution.checksum).toBe(1928);
  });

  it("should have an attribute 'wholeFileSystem' which instead of moving individual sectors moves whole files from the right to available space on the left, if available", () => {
    expect(solution.wholeFileSystem.join("")).toEqual(
      "00992111777.44.333....5555.6666.....8888.."
    );
  });

  it("should have an accessor 'fileChecksum' that returns the sum of the wholeFileSystem entries multiplied by their index", () => {
    expect(solution.wholeFileChecksum).toBe(2858);
  });
});
