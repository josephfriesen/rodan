import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Matrix, { CoordinatesType, EntryType } from "@lib/aoc/Matrix";
import Queue from "@lib/aoc/Queue";
import Stack from "../Stack";

export default class Day15Solution extends SolutionBuilder {
  map: Matrix;
  instructions: Queue;
  WALL: string = "#";
  ROBOT: string = "@";
  BOX: string = "O";
  BOXLEFT: string = "[";
  BOXRIGHT: string = "]";
  EMPTY: string = ".";
  bigMap: Matrix;
  boxMap: Map<number, { left: CoordinatesType; right: CoordinatesType }>;

  constructor(input: string) {
    super(15, input);
    this.buildMap();
    this.buildBigMap();
  }

  private buildMap(): void {
    const lines: string[] = this.input.split("\n");
    const emptyIndex: number = lines.findIndex((l) => l === "");
    if (!emptyIndex || emptyIndex === -1) {
      throw new Error(
        "error parsing input, line break between map and instructions not found"
      );
    }
    const mapLines: string[] = lines.slice(0, emptyIndex);
    this.map = new Matrix(mapLines.map((l) => l.split("")));
  }

  private buildInstructions(): void {
    const lines: string[] = this.input.split("\n");
    const emptyIndex: number = lines.findIndex((l) => l === "");
    const instructionStrings: string[] = lines
      .slice(emptyIndex + 1, lines.length)
      .join("")
      .split("");
    this.instructions = new Queue();

    for (let i = 0; i < instructionStrings.length; i++) {
      const s = instructionStrings[i];
      this.instructions.enqueue(s);
    }
  }

  private buildBigMap(): void {
    const bigInput = this.input
      .replaceAll("#", "##")
      .replaceAll(".", "..")
      .replaceAll("@", "@.")
      .replaceAll("O", "[]");
    const lines = bigInput.split("\n");
    const emptyIndex = lines.findIndex((l) => l === "");
    this.bigMap = new Matrix(
      lines.slice(0, emptyIndex).map((l) => l.split(""))
    );
  }

  robotPosition(map: Matrix = this.map): [number, number] {
    const list: CoordinatesType[] = map.allOccurencePositions(this.ROBOT);
    if (
      !list ||
      list[0] === null ||
      !Array.isArray(list) ||
      list.length !== 1
    ) {
      throw new Error(
        "error fetching robot position, is the map still well-defined?"
      );
    }

    return list[0];
  }

  moveRobot(dSym: string, map: Matrix = this.map): void {
    const DIR_MAP = {
      "^": Matrix.DIRECTIONS.N,
      "<": Matrix.DIRECTIONS.W,
      ">": Matrix.DIRECTIONS.E,
      v: Matrix.DIRECTIONS.S,
    };

    const direction = DIR_MAP[dSym];
    if (!direction) {
      throw new Error("direction is invalid");
    }

    const moveStack: Stack = new Stack();
    let currentPosition: CoordinatesType = this.robotPosition(map);
    let currentEntry: EntryType = map.entry(
      currentPosition[0],
      currentPosition[1]
    );

    moveStack.push({ pos: currentPosition, entry: currentEntry });

    let count = 0;
    while (true) {
      count++;
      if (count > map.height + map.width) {
        // sanity check, prevent unexpected infinite loop
        throw new Error("huh?");
      }

      const nextPosition: CoordinatesType = map.traversal(
        currentPosition,
        direction
      );
      if (!nextPosition || !map.inbounds(nextPosition)) {
        throw new Error("invalid traversal position");
      }

      const nextEntry: EntryType = map.entry(nextPosition[0], nextPosition[1]);

      if (nextEntry === this.WALL) {
        return;
      }

      moveStack.push({ pos: nextPosition, entry: nextEntry });

      if (nextEntry === this.EMPTY) {
        break;
      }

      if ([this.BOX, this.BOXLEFT, this.BOXRIGHT].includes(nextEntry)) {
        currentPosition = nextPosition;
        currentEntry = nextEntry;
        continue;
      }

      throw new Error(
        "nextEntry is neither box, empty, nor wall? how did we get here?"
      );
    }

    let current: CoordinatesType = moveStack.pop().pos;
    while (!moveStack.isEmpty()) {
      const next: CoordinatesType = moveStack.pop().pos;
      map.transpose(current, next);
      current = next;
    }
  }

  executeAllInstructions(): void {
    this.buildInstructions();
    while (!this.instructions.isEmpty()) {
      const instruction: string = this.instructions.dequeue();
      this.moveRobot(instruction);
    }
  }

  get sumOfBoxGPS(): number {
    const boxes: CoordinatesType[] = this.map.allOccurencePositions(this.BOX);
    let sum = 0;
    for (const box of boxes) {
      if (box === null) {
        throw new Error("box is null");
      }
      const boxGPS = 100 * box[0] + box[1];
      sum += boxGPS;
    }
    return sum;
  }

  moveRobotBigMap(dSym: string): void {
    const DIR_MAP = {
      "^": Matrix.DIRECTIONS.N,
      "<": Matrix.DIRECTIONS.W,
      ">": Matrix.DIRECTIONS.E,
      v: Matrix.DIRECTIONS.S,
    };

    const direction = DIR_MAP[dSym];
    if (!direction) {
      throw new Error("direction is invalid");
    }

    if (
      direction === Matrix.DIRECTIONS.W ||
      direction === Matrix.DIRECTIONS.E
    ) {
      this.moveRobot(dSym, this.bigMap);
      return;
    }

    let block: CoordinatesType[] | null = this.getMoveBlock(direction);
    if (block === null) {
      return;
    }

    block = block.sort((a: [number, number], b: [number, number]) => {
      if (a[0] === b[0]) {
        return a[1] - b[1];
      }
      return a[0] - b[0];
    });
    if (direction === Matrix.DIRECTIONS.S) {
      block = block.reverse();
    }

    for (const coordinates of block) {
      const neighbor: CoordinatesType = this.bigMap.traversal(
        coordinates,
        direction
      );
      this.bigMap.transpose(coordinates, neighbor);
    }
  }

  getMoveBlock(dir: string): CoordinatesType[] | null {
    const block: CoordinatesType[] = [];
    const robot: CoordinatesType = this.robotPosition(this.bigMap);
    const queue: Queue = new Queue();
    queue.enqueue(robot);
    const visited: { [key: string]: boolean } = {};
    while (!queue.isEmpty()) {
      const current = queue.dequeue();
      if (visited[current]) {
        continue;
      }

      visited[current] = true;

      const currentEntry = this.bigMap.entry(current[0], current[1]);
      if (currentEntry === this.EMPTY) {
        continue;
      }

      if (currentEntry === this.WALL) {
        return null;
      }

      if ([this.ROBOT, this.BOXLEFT, this.BOXRIGHT].includes(currentEntry)) {
        block.push(current);
        const neighbor: CoordinatesType = this.bigMap.traversal(current, dir);
        queue.enqueue(neighbor);
        if (currentEntry === this.BOXLEFT) {
          queue.enqueue(this.bigMap.traversal(current, Matrix.DIRECTIONS.E));
        }
        if (currentEntry === this.BOXRIGHT) {
          queue.enqueue(this.bigMap.traversal(current, Matrix.DIRECTIONS.W));
        }
      }
    }

    return block;
  }

  executeBigMapInstructions(): void {
    this.buildInstructions();
    let i = 0;
    let uhoh = false;
    while (!this.instructions.isEmpty() && uhoh === false) {
      i++;
      const instruction: string = this.instructions.dequeue();

      this.moveRobotBigMap(instruction);

      // check for broken boxes
      const leftBoxes: CoordinatesType[] = this.bigMap.allOccurencePositions(
        this.BOXLEFT
      );
      for (const left of leftBoxes) {
        if (this.bigMap.entryE(...left) !== this.BOXRIGHT) {
          this.log("UH OH");
          this.log(`last instruction: ${instruction}   i:${i}`);
          this.log(`broken box at ${left}`);
          this.log(`entry E of left: ${this.bigMap.entryE(...left)}`);
          this.logMap();
          uhoh = true;
        }
      }
    }
  }

  get sumOfBigMapGPS(): number {
    let sum = 0;
    const boxes = this.bigMap.allOccurencePositions(this.BOXLEFT);
    for (const box of boxes) {
      if (box === null) {
        throw new Error("box is null");
      }
      const boxGPS = 100 * box[0] + box[1];
      sum += boxGPS;
    }
    return sum;
  }

  private logMap(): void {
    this.log(this.bigMap.toString());
  }
}
