import { SolutionBuilder } from '../SolutionBuilder';
import Matrix from '../Matrix';

type CoordinatesType = [number, number] | null;

export default class Day4Solution extends SolutionBuilder {
  matrix: Matrix;
  LETTERS: Array<string>;
  X: string;
  M: string;
  A: string;
  S: string;

  constructor(input: string) {
    super(4, input);
    this.LETTERS = ['X', 'M', 'A', 'S'];
    [this.X, this.M, this.A, this.S] = this.LETTERS;
    this.initializeMatrix();
  }

  private initializeMatrix(): void {
    const matrix = [];
    const lines = this.input.split('\n');
    for (const line of lines) {
      matrix.push(line.split(''));
    }
    this.matrix = new Matrix(matrix);
  }

  entryToWord(coordinates: CoordinatesType, direction: string): string | null {
    if (!coordinates) {
      throw new TypeError('invalid coordinates');
    }

    if (!Matrix.DIRECTIONS[direction]) {
      throw new TypeError('invalid direction');
    }

    const LENGTH = 4;
    let WORD = '';
    let currentCoordinates = coordinates;
    for (let iteration = 1; iteration <= LENGTH; iteration++) {
      if (currentCoordinates === null) return null;
      const [i, j] = currentCoordinates;

      const currentEntry = this.matrix.entry(i, j);

      WORD += currentEntry;
      currentCoordinates = this.matrix.traversal(currentCoordinates, direction);
    }

    return WORD;
  }

  get countXmases(): number {
    let count = 0;
    for (let i = 0; i < this.matrix.height; i++) {
      for (let j = 0; j < this.matrix.width; j++) {
        for (const direction in Matrix.DIRECTIONS) {
          const word = this.entryToWord([i, j], direction);
          if (word === 'XMAS') count++;
        }
      }
    }

    return count;
  }

  entryIsEx(i: number, j: number): boolean {
    const nwse = `${this.matrix.entryNW(i, j) ?? ''}${this.matrix.entry(i, j)}${this.matrix.entrySE(i, j) ?? ''}`;
    const nesw = `${this.matrix.entryNE(i, j) ?? ''}${this.matrix.entry(i, j)}${this.matrix.entrySW(i, j) ?? ''}`;
    const MASSES = ['SAM', 'MAS'];
    return MASSES.includes(nwse) && MASSES.includes(nesw);
  }

  get countXmasExes(): number {
    let count = 0;
    for (let i = 0; i < this.matrix.height; i++) {
      for (let j = 0; j < this.matrix.width; j++) {
        if (this.entryIsEx(i, j)) count++;
      }
    }

    return count;
  }
}
