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
    expect(solution.matrix[0]).toEqual([
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

  it("should have parameters width and height, representing the dimensions of the matrix", () => {
    expect(solution.width).toBe(10);
    expect(solution.height).toBe(10);
  });

  it("should have a row accessor method", () => {
    expect(solution.row).toBeDefined();
    expect(solution.row(9)).toEqual([
      "M",
      "X",
      "M",
      "X",
      "A",
      "X",
      "M",
      "A",
      "S",
      "X",
    ]);
  });

  it("should have a column accessor method", () => {
    expect(solution.column).toBeDefined();
    expect(solution.column(5)).toEqual([
      "X",
      "M",
      "M",
      "S",
      "M",
      "X",
      "A",
      "A",
      "X",
      "X",
    ]);
  });

  it("should have an entry accessor method", () => {
    expect(solution.entry).toBeDefined();
    expect(solution.entry(0, 0)).toBe("M");
    expect(solution.entry(6, 4)).toBe("S");
    expect(solution.entry(2, 7)).toBe("A");
  });

  it("should have an entry accessor method entryW that returns the entry to the left of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryW).toBeDefined();
    expect(solution.entryW(4, 0)).toBe(null);
    expect(solution.entryW(4, 5)).toBe("A");
    expect(solution.entryW(9, 9)).toBe("S");
  });

  it("should have an entry accessor method entryE that returns the entry to the right of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryE).toBeDefined();
    expect(solution.entryE(0, 9)).toBe(null);
    expect(solution.entryE(4, 5)).toBe("X");
    expect(solution.entryE(9, 8)).toBe("X");
  });

  it("should have an entry accessor method entryN that returns the entry above the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryN).toBeDefined();
    expect(solution.entryN(0, 5)).toBe(null);
    expect(solution.entryN(4, 5)).toBe("S");
    expect(solution.entryN(9, 9)).toBe("M");
  });

  it("should have an entry accessor method entryS that returns the entry below the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryS).toBeDefined();
    expect(solution.entryS(9, 4)).toBe(null);
    expect(solution.entryS(4, 5)).toBe("X");
    expect(solution.entryS(0, 3)).toBe("M");
  });

  it("should have an entry accessor method entryNW that returns the entry above and to the left of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryNW).toBeDefined();
    expect(solution.entryNW(1, 0)).toBe(null);
    expect(solution.entryNW(0, 1)).toBe(null);
    expect(solution.entryNW(4, 5)).toBe("A");
    expect(solution.entryNW(9, 9)).toBe("M");
  });

  it("should have an entry accessor method entryNE that returns the entry above and to the right of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entryNE).toBeDefined();
    expect(solution.entryNE(1, 9)).toBe(null);
    expect(solution.entryNE(0, 8)).toBe(null);
    expect(solution.entryNE(4, 5)).toBe("M");
    expect(solution.entryNE(9, 8)).toBe("M");
  });

  it("should have an entry accessor method entrySW that returns the entry below and to the left of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entrySW).toBeDefined();
    expect(solution.entrySW(8, 0)).toBe(null);
    expect(solution.entrySW(9, 1)).toBe(null);
    expect(solution.entrySW(4, 5)).toBe("M");
    expect(solution.entrySW(0, 3)).toBe("A");
  });

  it("should have an entry accessor method entrySE that returns the entry below and to the right of the entry at (i,j) or null if such an entry does not exist", () => {
    expect(solution.entrySE).toBeDefined();
    expect(solution.entrySE(8, 9)).toBe(null);
    expect(solution.entrySE(9, 8)).toBe(null);
    expect(solution.entrySE(4, 5)).toBe("X");
    expect(solution.entrySE(0, 3)).toBe("X");
  });

  it("should have a method traversal that, given starting coordinates and direction, returns the coordinates of the next entry in that direction, or null if there is no such entry", () => {
    expect(solution.traversal).toBeDefined();

    const TOPLEFT = [0, 0];
    expect(solution.traversal(TOPLEFT, "W")).toEqual(null);
    expect(solution.traversal(TOPLEFT, "E")).toEqual([0, 1]);
    expect(solution.traversal(TOPLEFT, "N")).toEqual(null);
    expect(solution.traversal(TOPLEFT, "S")).toEqual([1, 0]);
    expect(solution.traversal(TOPLEFT, "NW")).toEqual(null);
    expect(solution.traversal(TOPLEFT, "NE")).toEqual(null);
    expect(solution.traversal(TOPLEFT, "SW")).toEqual(null);
    expect(solution.traversal(TOPLEFT, "SE")).toEqual([1, 1]);

    const BOTTOMRIGHT = [9, 9];
    expect(solution.traversal(BOTTOMRIGHT, "W")).toEqual([9, 8]);
    expect(solution.traversal(BOTTOMRIGHT, "E")).toEqual(null);
    expect(solution.traversal(BOTTOMRIGHT, "N")).toEqual([8, 9]);
    expect(solution.traversal(BOTTOMRIGHT, "S")).toEqual(null);
    expect(solution.traversal(BOTTOMRIGHT, "NW")).toEqual([8, 8]);
    expect(solution.traversal(BOTTOMRIGHT, "NE")).toEqual(null);
    expect(solution.traversal(BOTTOMRIGHT, "SW")).toEqual(null);
    expect(solution.traversal(BOTTOMRIGHT, "SE")).toEqual(null);

    const MIDDLE = [4, 5];
    expect(solution.traversal(MIDDLE, "W")).toEqual([4, 4]);
    expect(solution.traversal(MIDDLE, "E")).toEqual([4, 6]);
    expect(solution.traversal(MIDDLE, "N")).toEqual([3, 5]);
    expect(solution.traversal(MIDDLE, "S")).toEqual([5, 5]);
    expect(solution.traversal(MIDDLE, "NW")).toEqual([3, 4]);
    expect(solution.traversal(MIDDLE, "NE")).toEqual([3, 6]);
    expect(solution.traversal(MIDDLE, "SW")).toEqual([5, 4]);
    expect(solution.traversal(MIDDLE, "SE")).toEqual([5, 6]);
  });

  it("should have an entryToWord method that takes a starting point and direction and constructs a 4-letter word, or returns null if no word exists", () => {
    expect(solution.entryToWord).toBeDefined();

    const BADSTART = [1, 1];
    const BADDIRECTION = "W";
    expect(solution.entryToWord(BADSTART, BADDIRECTION)).toBe(null);
    expect(solution.entryToWord([8, 8], "NE")).toBe(null);

    expect(solution.entryToWord([3, 0], "N")).toBe("MAMM");
    expect(solution.entryToWord([4, 5], "SE")).toBe("MXXA");
  });

  it("should have a method countXmases that returns the number of ways to find the string 'XMAS' in the matrix", () => {
    expect(solution.countXmases).toEqual(18);
  });
});
