export type EntryType = string | number;
export type CoordinatesType = [number, number] | null;

export default class Matrix {
  matrix: Array<Array<EntryType>>;
  width: number;
  height: number;

  constructor(input: Array<Array<EntryType>>) {
    this.matrix = input;
    this.width = input[0]?.length ?? 0;
    this.height = input.length ?? 0;
  }

  row(index: number): Array<EntryType> {
    return this.matrix[index];
  }

  column(index: number): Array<EntryType> {
    return this.matrix.map((row) => row[index]);
  }

  insertEntry(coordinates: CoordinatesType, entry: EntryType): void {
    if (!coordinates) {
      return;
    }
    const [i, j] = coordinates;
    this.matrix[i][j] = entry;
  }

  transpose(a: CoordinatesType, b: CoordinatesType): void {
    if (
      !a ||
      !b ||
      !Array.isArray(a) ||
      !Array.isArray(b) ||
      !this.inbounds(a) ||
      !this.inbounds(b)
    ) {
      throw new TypeError(
        "transpose requires two arguments of type [number, number] each of which is a valid matrix coordinate pair"
      );
    }

    const entryA: EntryType = this.entry(a[0], a[1]);
    const entryB: EntryType = this.entry(b[0], b[1]);
    this.insertEntry(a, entryB);
    this.insertEntry(b, entryA);
  }

  entry(i: number, j: number): EntryType {
    return this.matrix[i][j];
  }

  entryW(i: number, j: number): EntryType | null {
    if (j - 1 < 0) return null;

    return this.entry(i, j - 1);
  }

  entryE(i: number, j: number): EntryType | null {
    if (j + 1 >= this.width) return null;

    return this.entry(i, j + 1);
  }

  entryN(i: number, j: number): EntryType | null {
    if (i - 1 < 0) return null;

    return this.entry(i - 1, j);
  }

  entryS(i: number, j: number): EntryType | null {
    if (i + 1 >= this.height) return null;

    return this.entry(i + 1, j);
  }

  entryNW(i: number, j: number): EntryType | null {
    if (i - 1 < 0 || j - 1 < 0) return null;

    return this.entry(i - 1, j - 1);
  }

  entryNE(i: number, j: number): EntryType | null {
    if (i - 1 < 0 || j + 1 >= this.width) return null;

    return this.entry(i - 1, j + 1);
  }

  entrySW(i: number, j: number): EntryType | null {
    if (i + 1 >= this.height || j - 1 < 0) return null;

    return this.entry(i + 1, j - 1);
  }

  entrySE(i: number, j: number): EntryType | null {
    if (i + 1 >= this.height || j + 1 >= this.width) return null;

    return this.entry(i + 1, j + 1);
  }

  neighborhoodCardinal(i: number, j: number): CoordinatesType[] {
    return [
      this.coordinatesN(i, j),
      this.coordinatesE(i, j),
      this.coordinatesS(i, j),
      this.coordinatesW(i, j),
    ].filter(Boolean);
  }

  neighborhoodOrdinal(i: number, j: number): CoordinatesType[] {
    return [
      this.coordinatesNE(i, j),
      this.coordinatesNW(i, j),
      this.coordinatesSE(i, j),
      this.coordinatesSW(i, j),
    ].filter(Boolean);
  }

  neighborhoodAll(i: number, j: number): CoordinatesType[] {
    return [
      ...this.neighborhoodCardinal(i, j),
      ...this.neighborhoodOrdinal(i, j),
    ];
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

  static DIRECTIONS: { [key: string]: string } = {
    W: "W",
    E: "E",
    N: "N",
    S: "S",
    NW: "NW",
    NE: "NE",
    SW: "SW",
    SE: "SE",
  };

  traversal(coordinates: CoordinatesType, direction: string): CoordinatesType {
    if (!coordinates || !Matrix.DIRECTIONS[direction]) {
      throw new TypeError(
        `invalid entry or direction. coordinates: ${coordinates}, direction: ${direction}, Matrix.DIRECTIONS[direction]: ${Matrix.DIRECTIONS[direction]}`
      );
    }

    const { W, E, N, S, NW, NE, SW, SE } = Matrix.DIRECTIONS;
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

    return coordinateMap.get(direction)?.(i, j) ?? null;
  }

  traverseEntry(
    coordinates: CoordinatesType,
    direction: string
  ): EntryType | null {
    if (!coordinates || !Matrix.DIRECTIONS[direction]) {
      throw new TypeError(
        `invalid entry or direction. coordinates: ${coordinates}, direction: ${direction}, Matrix.DIRECTIONS[direction]: ${Matrix.DIRECTIONS[direction]}`
      );
    }
    const nextCoordinates = this.traversal(coordinates, direction);
    return nextCoordinates ? this.entry(...nextCoordinates) : null;
  }

  inbounds(coordinates: CoordinatesType): boolean {
    if (!coordinates) {
      return false;
    }
    const [a, b] = coordinates;
    return a >= 0 && a < this.height && b >= 0 && b < this.width;
  }

  countOccurences(value: EntryType): number {
    return this.matrix.flat().filter((entry) => entry === value).length;
  }

  allOccurencePositions(value: EntryType): Array<CoordinatesType> {
    return this.matrix
      .map((row, i) => row.map((entry, j) => [i, j] as CoordinatesType))
      .flat()
      .filter(
        (coord: CoordinatesType) =>
          coord !== null && this.entry(...coord) === value
      );
  }

  find(value: EntryType): CoordinatesType | undefined {
    return this.matrix
      .map((row, i) => row.map((entry, j) => [i, j] as CoordinatesType))
      .flat()
      .find(
        (coord: CoordinatesType) =>
          coord !== null && this.entry(...coord) === value
      );
  }

  manhattanDistance(a: CoordinatesType, b: CoordinatesType): number {
    if (a === null || b === null) {
      throw new TypeError("coordinate pairs are ill-defined");
    }
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  clone(): Matrix {
    return new Matrix(this.matrix.map((row) => [...row]));
  }

  toString(): string {
    return this.matrix.map((row) => row.join("")).join("\n");
  }
}
