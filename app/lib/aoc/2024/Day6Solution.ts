import { SolutionBuilder } from "../SolutionBuilder";
import Matrix from "@lib/aoc/Matrix";

export default class Day6Solution extends SolutionBuilder {
  initial: Matrix;
  private STOP: string = "#";
  private EMPTY: string = ".";
  private MARKED: string = "X";
  private GUARDS: string[] = ["<", "^", ">", "v"];
  private OBSTRUCTIONS: Array<[number, number]> = [];
  private GUARD_START: [number, number];
  private DIRECTIONS: string[] = [
    Matrix.DIRECTIONS.W,
    Matrix.DIRECTIONS.N,
    Matrix.DIRECTIONS.E,
    Matrix.DIRECTIONS.S,
  ];

  constructor(input: string) {
    super(6, input);
    this.initializeMatrix();
  }

  initializeMatrix(): void {
    this.initial = new Matrix(
      this.input.split("\n").map((line) => line.split("")),
    );

    // replace the guard character with one of our direction traversal keys, easier that way.
    for (let i = 0; i < this.initial.height; i++) {
      for (let j = 0; j < this.initial.width; j++) {
        if (this.GUARDS.includes(this.initial.entry(i, j))) {
          this.initial.insertEntry(
            [i, j],
            this.DIRECTIONS[this.GUARDS.indexOf(this.initial.entry(i, j))],
          );
          this.GUARD_START = [i, j];
        } else if (this.initial.entry(i, j) === this.STOP) {
          this.OBSTRUCTIONS.push([i, j]);
        }
      }
    }
  }

  get guardPosition(): [number, number] {
    if (!this.GUARD_START) {
      throw new Error(
        "guard not found. was matrix initialized properly? is input valid?",
      );
    }

    return this.GUARD_START;
  }

  get guardDirection(): string {
    return this.initial.entry(...this.GUARD_START);
  }

  guardTraversal(): Matrix {
    // TODO: as currently built this can have infinite loops.
    let position: [number, number] | null = this.guardPosition;
    let direction: string | null = this.guardDirection;
    const m: Matrix = this.initial.clone();

    while (position !== null) {
      const nextPosition: [number, number] = m.traversal(position, direction);
      if (nextPosition === null) {
        m.insertEntry(position, this.MARKED);
        position = null;
        direction = null;
        break;
      }

      const nextEntry = m.entry(...nextPosition);

      if (nextEntry === this.STOP) {
        direction =
          this.DIRECTIONS[(this.DIRECTIONS.indexOf(direction) + 1) % 4];
      } else if ([this.EMPTY, this.MARKED].includes(nextEntry)) {
        m.insertEntry(position, this.MARKED);
        m.insertEntry(nextPosition, direction);
        position = nextPosition;
      }
    }

    return m;
  }

  get visitedCount(): number {
    if (this.isCached && this.cachedSolution.visitedCount) {
      return this.cachedSolution.visitedCount;
    }

    const solution: number = this.guardTraversal().countOccurences(this.MARKED);
    this.cacheSolution("visitedCount", solution);
    return solution;
  }

  // given the initial map and a possible obstruction position, check if this would induce the guard into a traversal loop.
  // we can say the guard will follow the same path ad infinitum if, when reaching an obstruction, the guard has
  // previously visited that obstruction from that same direction, as they will then proceed along the same path they
  // had previously traversed before ending back at the same obstruction and direction, etc. if this is the case, return true
  // if the guard is able to escape the bounds of the matrix, the traversal terminates, return false.
  checkForGuardLoop(obstruction: [number, number]): boolean {
    const m: Matrix = this.initial.clone();
    m.insertEntry(obstruction, this.STOP);

    let position: [number, number] | null = this.guardPosition;
    let direction: string | null = this.guardDirection;

    const visited: Map<string, string[]> = new Map();
    for (const o of [...this.OBSTRUCTIONS, obstruction]) {
      visited.set(o.toString(), []);
    }

    while (position !== null) {
      const nextPosition: [number, number] = m.traversal(position, direction);

      // the next position is out of bounds, the guard will escape, return false.
      if (nextPosition === null) {
        return false;
      }

      // the next position is an obstruction
      if (m.entry(...nextPosition) === this.STOP) {
        // the guard has visited this obstruction from this direction previously, the guard will proceed in an infinite
        // loop, exit with true
        if (visited.get(nextPosition.toString()).includes(direction)) {
          return true;
        }
        // mark this direction as visited for this obstruction, and turn guard to the next direction
        else {
          visited.get(nextPosition.toString()).push(direction);
          direction =
            this.DIRECTIONS[(this.DIRECTIONS.indexOf(direction) + 1) % 4];
        }
      }
      // the next position is clear, advance the guard forward in the current direction.
      else {
        position = nextPosition;
      }
    }
  }

  get countGuardLoops(): number {
    if (this.isCached && this.cachedSolution.countGuardLoops) {
      return this.cachedSolution.countGuardLoops;
    }

    const obstructionsToCheck: Array<[number, number]> =
      this.initial.allOccurencePositions(".");
    const solution: number = obstructionsToCheck.reduce((acc, obstruction) => {
      if (this.checkForGuardLoop(obstruction)) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);

    this.cacheSolution("countGuardLoops", solution);
    return solution;
  }
}
