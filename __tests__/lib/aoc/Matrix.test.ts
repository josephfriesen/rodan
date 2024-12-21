import Matrix from "@lib/aoc/Matrix";

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

const arrays = input.split("\n").map((line) => line.split(""));

const matrix = new Matrix(arrays);

it("should have parameters width and height, representing the dimensions of the matrix", () => {
  expect(matrix.width).toBe(10);
  expect(matrix.height).toBe(10);
});

it("should have a row accessor method", () => {
  expect(matrix.row).toBeDefined();
  expect(matrix.row(9)).toEqual([
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
  expect(matrix.column).toBeDefined();
  expect(matrix.column(5)).toEqual([
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
  expect(matrix.entry).toBeDefined();
  expect(matrix.entry(0, 0)).toBe("M");
  expect(matrix.entry(6, 4)).toBe("S");
  expect(matrix.entry(2, 7)).toBe("A");
});

it("should have an entry accessor method entryW that returns the entry to the left of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryW).toBeDefined();
  expect(matrix.entryW(4, 0)).toBe(null);
  expect(matrix.entryW(4, 5)).toBe("A");
  expect(matrix.entryW(9, 9)).toBe("S");
});

it("should have an entry accessor method entryE that returns the entry to the right of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryE).toBeDefined();
  expect(matrix.entryE(0, 9)).toBe(null);
  expect(matrix.entryE(4, 5)).toBe("X");
  expect(matrix.entryE(9, 8)).toBe("X");
});

it("should have an entry accessor method entryN that returns the entry above the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryN).toBeDefined();
  expect(matrix.entryN(0, 5)).toBe(null);
  expect(matrix.entryN(4, 5)).toBe("S");
  expect(matrix.entryN(9, 9)).toBe("M");
});

it("should have an entry accessor method entryS that returns the entry below the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryS).toBeDefined();
  expect(matrix.entryS(9, 4)).toBe(null);
  expect(matrix.entryS(4, 5)).toBe("X");
  expect(matrix.entryS(0, 3)).toBe("M");
});

it("should have an entry accessor method entryNW that returns the entry above and to the left of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryNW).toBeDefined();
  expect(matrix.entryNW(1, 0)).toBe(null);
  expect(matrix.entryNW(0, 1)).toBe(null);
  expect(matrix.entryNW(4, 5)).toBe("A");
  expect(matrix.entryNW(9, 9)).toBe("M");
});

it("should have an entry accessor method entryNE that returns the entry above and to the right of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entryNE).toBeDefined();
  expect(matrix.entryNE(1, 9)).toBe(null);
  expect(matrix.entryNE(0, 8)).toBe(null);
  expect(matrix.entryNE(4, 5)).toBe("M");
  expect(matrix.entryNE(9, 8)).toBe("M");
});

it("should have an entry accessor method entrySW that returns the entry below and to the left of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entrySW).toBeDefined();
  expect(matrix.entrySW(8, 0)).toBe(null);
  expect(matrix.entrySW(9, 1)).toBe(null);
  expect(matrix.entrySW(4, 5)).toBe("M");
  expect(matrix.entrySW(0, 3)).toBe("A");
});

it("should have an entry accessor method entrySE that returns the entry below and to the right of the entry at (i,j) or null if such an entry does not exist", () => {
  expect(matrix.entrySE).toBeDefined();
  expect(matrix.entrySE(8, 9)).toBe(null);
  expect(matrix.entrySE(9, 8)).toBe(null);
  expect(matrix.entrySE(4, 5)).toBe("X");
  expect(matrix.entrySE(0, 3)).toBe("X");
});

it("should have a method traversal that, given starting coordinates and direction, returns the coordinates of the next entry in that direction, or null if there is no such entry", () => {
  expect(matrix.traversal).toBeDefined();

  expect(() => {
    matrix.traversal([0, 0], "Not a Direction");
  }).toThrow(TypeError);

  const TOPLEFT: [number, number] = [0, 0];
  expect(matrix.traversal(TOPLEFT, "W")).toEqual(null);
  expect(matrix.traversal(TOPLEFT, "E")).toEqual([0, 1]);
  expect(matrix.traversal(TOPLEFT, "N")).toEqual(null);
  expect(matrix.traversal(TOPLEFT, "S")).toEqual([1, 0]);
  expect(matrix.traversal(TOPLEFT, "NW")).toEqual(null);
  expect(matrix.traversal(TOPLEFT, "NE")).toEqual(null);
  expect(matrix.traversal(TOPLEFT, "SW")).toEqual(null);
  expect(matrix.traversal(TOPLEFT, "SE")).toEqual([1, 1]);

  const BOTTOMRIGHT: [number, number] = [9, 9];
  expect(matrix.traversal(BOTTOMRIGHT, "W")).toEqual([9, 8]);
  expect(matrix.traversal(BOTTOMRIGHT, "E")).toEqual(null);
  expect(matrix.traversal(BOTTOMRIGHT, "N")).toEqual([8, 9]);
  expect(matrix.traversal(BOTTOMRIGHT, "S")).toEqual(null);
  expect(matrix.traversal(BOTTOMRIGHT, "NW")).toEqual([8, 8]);
  expect(matrix.traversal(BOTTOMRIGHT, "NE")).toEqual(null);
  expect(matrix.traversal(BOTTOMRIGHT, "SW")).toEqual(null);
  expect(matrix.traversal(BOTTOMRIGHT, "SE")).toEqual(null);

  const MIDDLE: [number, number] = [4, 5];
  expect(matrix.traversal(MIDDLE, "W")).toEqual([4, 4]);
  expect(matrix.traversal(MIDDLE, "E")).toEqual([4, 6]);
  expect(matrix.traversal(MIDDLE, "N")).toEqual([3, 5]);
  expect(matrix.traversal(MIDDLE, "S")).toEqual([5, 5]);
  expect(matrix.traversal(MIDDLE, "NW")).toEqual([3, 4]);
  expect(matrix.traversal(MIDDLE, "NE")).toEqual([3, 6]);
  expect(matrix.traversal(MIDDLE, "SW")).toEqual([5, 4]);
  expect(matrix.traversal(MIDDLE, "SE")).toEqual([5, 6]);
});
