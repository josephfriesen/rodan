import Day4Solution from "@lib/aoc/2024/Day4Solution";

const input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

/* neighborhood of (4, 5):
ASM
AMX
MXX
*/

const solution = new Day4Solution(input);

describe("Day 4 Solution", () => {
  it("should have DAY == 4", () => {
    expect(solution.DAY).toBe(4);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
    expect(solution.input).toBe(input);
  });

  it("should have LETTERS", () => {
    expect(solution.LETTERS).toBeDefined();
    expect(solution.LETTERS).toEqual(["X", "M", "A", "S"]);
    expect(solution.X).toBe("X");
    expect(solution.M).toBe("M");
    expect(solution.A).toBe("A");
    expect(solution.S).toBe("S");
  });

  it("should have a matrix consisting of individual letters from the input", () => {
    expect(solution.matrix).toBeDefined();
    expect(solution.matrix.row(0)).toEqual([
      "M",
      "M",
      "M",
      "S",
      "X",
      "X",
      "M",
      "A",
      "S",
      "M",
    ]);
  });

  it("should have an entryToWord method that takes a starting point and direction and constructs a 4-letter word, or returns null if no word exists", () => {
    expect(solution.entryToWord).toBeDefined();

    expect(() => {
      solution.entryToWord(null, "NE");
    }).toThrow(TypeError);
    expect(() => {
      solution.entryToWord([0, 0], "invalid direction");
    }).toThrow(TypeError);

    const BADSTART: [number, number] = [1, 1];
    const BADDIRECTION: string = "W";
    expect(solution.entryToWord(BADSTART, BADDIRECTION)).toBe(null);
    expect(solution.entryToWord([8, 8], "NE")).toBe(null);

    expect(solution.entryToWord([3, 0], "N")).toBe("MAMM");
    expect(solution.entryToWord([4, 5], "SE")).toBe("MXXA");
  });

  it("should have a method countXmases that returns the number of ways to find the string 'XMAS' in the matrix", () => {
    expect(solution.countXmases).toEqual(18);
  });

  it("should have an entryIsEx method that checks if an entry is the center of an X-MAS", () => {
    expect(solution.entryIsEx).toBeDefined();
    expect(solution.entryIsEx(1, 2)).toBe(true);
    expect(solution.entryIsEx(0, 3)).toBe(false);
    expect(solution.entryIsEx(5, 3)).toBe(false);
  });

  it("should have a getter countXmasExes that returns the number of X-MASes", () => {
    expect(solution.countXmasExes).toEqual(9);
  });
});
