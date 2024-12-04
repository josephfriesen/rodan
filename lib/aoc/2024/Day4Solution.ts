import { number } from "mathjs";
import { SolutionBuilder } from "../SolutionBuilder";

type EntryType = string | null;
type CoordinatesType = [number, number] | null;
type DirectionFuncType = (i: number, j: number) => EntryType;
type CoordinatesFuncType = (i: number, j: number) => CoordinatesType;

export default class Day4Solution extends SolutionBuilder {
  matrix: Array<Array<string>>;
  width: number;
  height: number;
  LETTERS: Array<string>;
  X: string;
  M: string;
  A: string;
  S: string;

  constructor(input: string) {
    super(4, input);
    this.LETTERS = ["X", "M", "A", "S"];
    [this.X, this.M, this.A, this.S] = this.LETTERS;
    this.matrix = [];
    this.width = 0;
    this.height = 0;
    this.initializeMatrix();
  }

  private initializeMatrix(): void {
    const lines = this.input.split("\n");
    for (const line of lines) {
      this.matrix.push(line.split(""));
    }
    this.height = lines.length;
    this.width = lines[0].length;
  }

  row(index: number): Array<string> {
    return this.matrix[index];
  }

  column(index: number): Array<string> {
    return this.matrix.map((row) => row[index]);
  }

  entry(i: number, j: number): EntryType {
    return this.matrix[i][j];
  }

  entryW(i: number, j: number): EntryType {
    if (j - 1 < 0) return null;

    return this.entry(i, j - 1);
  }

  entryE(i: number, j: number): EntryType {
    if (j + 1 >= this.width) return null;

    return this.entry(i, j + 1);
  }

  entryN(i: number, j: number): EntryType {
    if (i - 1 < 0) return null;

    return this.entry(i - 1, j);
  }

  entryS(i: number, j: number): EntryType {
    if (i + 1 >= this.height) return null;

    return this.entry(i + 1, j);
  }

  entryNW(i: number, j: number): EntryType {
    if (i - 1 < 0 || j - 1 < 0) return null;

    return this.entry(i - 1, j - 1);
  }

  entryNE(i: number, j: number): EntryType {
    if (i - 1 < 0 || j + 1 >= this.width) return null;

    return this.entry(i - 1, j + 1);
  }

  entrySW(i: number, j: number): EntryType {
    if (i + 1 >= this.height || j - 1 < 0) return null;

    return this.entry(i + 1, j - 1);
  }

  entrySE(i: number, j: number): EntryType {
    if (i + 1 >= this.height || j + 1 >= this.width) return null;

    return this.entry(i + 1, j + 1);
  }

  coordinatesW(i: number, j: number): CoordinatesType {
    if (j - 1 < 0) return null;

    return [i, j - 1];
  }

  coordinatesE(i: number, j: number): CoordinatesType {
    if (j + 1 >= this.width) return null;

    return [i, j + 1];
  }

  coordinatesN(i: number, j: number): CoordinatesType {
    if (i - 1 < 0) return null;

    return [i - 1, j];
  }

  coordinatesS(i: number, j: number): CoordinatesType {
    if (i + 1 >= this.height) return null;

    return [i + 1, j];
  }

  coordinatesNW(i: number, j: number): CoordinatesType {
    if (i - 1 < 0 || j - 1 < 0) return null;

    return [i - 1, j - 1];
  }

  coordinatesNE(i: number, j: number): CoordinatesType {
    if (i - 1 < 0 || j + 1 >= this.width) return null;

    return [i - 1, j + 1];
  }

  coordinatesSW(i: number, j: number): CoordinatesType {
    if (i + 1 >= this.height || j - 1 < 0) return null;

    return [i + 1, j - 1];
  }

  coordinatesSE(i: number, j: number): CoordinatesType {
    if (i + 1 >= this.height || j + 1 >= this.width) return null;

    return [i + 1, j + 1];
  }

  static KEYS: { [key: string]: string } = {
    W: "W",
    E: "E",
    N: "N",
    S: "S",
    NW: "NW",
    NE: "NE",
    SW: "SW",
    SE: "SE",
  };

  private direction(direction: string): DirectionFuncType {
    if (!this.KEYS[direction]) {
      throw new TypeError("invalid direction");
    }

    const { W, E, N, S, NW, NE, SW, SE } = this.KEYS;
    const directionMap = new Map([
      [W, this.entryW],
      [E, this.entryE],
      [N, this.entryN],
      [S, this.entryS],
      [NW, this.entryNW],
      [NE, this.entryNE],
      [SW, this.entrySW],
      [SE, this.entrySE],
    ]);

    return directionMap.get(direction);
  }

  private coordinate(direction: string): CoordinatesFuncType {
    if (!this.KEYS[direction]) {
      throw new TypeError("invalid direction");
    }

    const { W, E, N, S, NW, NE, SW, SE } = this.KEYS;
    const coordinateMap = new Map([
      [W, this.coordinatesW],
      [E, this.coordinatesE],
      [N, this.coordinatesN],
      [S, this.coordinatesS],
      [NW, this.coordinatesNW],
      [NE, this.coordinatesNE],
      [SW, this.coordinatesSW],
      [SE, this.coordinatesSE],
    ]);

    return coordinateMap.get(direction);
  }

  private traversal(
    coordinates: CoordinatesType,
    direction: string
  ): CoordinatesType {
    if (!coordinates || !Day4Solution.KEYS[direction]) {
      throw new TypeError("invalid entry or direction");
    }

    const { W, E, N, S, NW, NE, SW, SE } = Day4Solution.KEYS;
    const [i, j] = coordinates;
    const coordinateMap = new Map([
      [W, (i: number, j: number) => this.coordinatesW(i, j)],
      [E, (i: number, j: number) => this.coordinatesE(i, j)],
      [N, (i: number, j: number) => this.coordinatesN(i, j)],
      [S, (i: number, j: number) => this.coordinatesS(i, j)],
      [NW, (i: number, j: number) => this.coordinatesNW(i, j)],
      [NE, (i: number, j: number) => this.coordinatesNE(i, j)],
      [SW, (i: number, j: number) => this.coordinatesSW(i, j)],
      [SE, (i: number, j: number) => this.coordinatesSE(i, j)],
    ]);

    return coordinateMap.get(direction)(i, j);
  }

  private entryToWord(
    coordinates: CoordinatesType,
    direction: string
  ): string | null {
    if (!coordinates) {
      throw new TypeError("invalid coordinates");
    }

    if (!Day4Solution.KEYS[direction]) {
      throw new TypeError("invalid direction");
    }

    const LENGTH = 4;
    let WORD = "";
    let currentCoordinates = coordinates;
    for (let iteration = 1; iteration <= LENGTH; iteration++) {
      if (currentCoordinates === null) return null;
      const [i, j] = currentCoordinates;

      const currentEntry = this.entry(i, j);
      if (currentEntry === null) return null;

      WORD += currentEntry;
      currentCoordinates = this.traversal(currentCoordinates, direction);
    }

    return WORD;
  }

  get countXmases(): number {
    try {
      let count = 0;
      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          for (const direction in Day4Solution.KEYS) {
            const word = this.entryToWord([i, j], direction);
            if (word === "XMAS") count++;
          }
        }
      }

      return count;
    } catch (err) {
      console.error(err);
    }
  }
}
