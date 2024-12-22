import { SolutionBuilder } from "../SolutionBuilder";

export default class Day9Solution extends SolutionBuilder {
  diskMap: Array<string>;
  fileSystem: Array<string> = [];
  wholeFileSystem: Array<string> = [];

  constructor(input: string) {
    super(9, input);
    this.initializeDiskMap();
    this.moveDiskToFileSystem();
    this.moveWholeFileSystem();
    this.setSolutions();
  }

  private initializeDiskMap(): void {
    this.diskMap = [];
    const inputSplit: Array<string> = this.input.split("");
    let id = 0;
    for (let i = 0; i < inputSplit.length; i++) {
      const parity: number = i % 2;
      if (parity === 0) {
        // current position inputSplit[i] represents a file of size Number(inputSplit[i])
        this.diskMap = [
          ...this.diskMap,
          ...Array(Number(inputSplit[i])).fill(String(id)),
        ];
        id++;
      }
      if (parity === 1) {
        // current position inputSplit[i] represents inputSplit[i] sectors of free space
        this.diskMap = [
          ...this.diskMap,
          ...Array(Number(inputSplit[i])).fill("."),
        ];
      }
    }
  }

  private moveDiskToFileSystem(): void {
    this.fileSystem = [...this.diskMap];
    let i = 0; // target index, move the file id to this position if it is empty (== ".")
    let j = this.diskMap.length - 1; // source index, move this file id to i if it is not empty
    while (i < j) {
      // source is empty, move pointer to the left 1 position and continue
      if (this.fileSystem[j] === ".") {
        j--;
        continue;
      }

      if (this.fileSystem[i] !== ".") {
        // target is non-empty, move to the right 1 position and continue
        i++;
        continue;
      }

      // source is a file id to be moved, target is an empty sector.
      // (1) set target to file id
      // (2) set source to "."
      this.fileSystem[i] = this.diskMap[j];
      this.fileSystem[j] = ".";
    }
  }

  moveWholeFileSystem(): void {
    /*
     * psuedo code
     * let fileRight = out.length - 1;
     * fileRight is a pointer starting at the end of out. we iterate from the end to 0.
     * if out[fileRight] is a file id, and visited[out[fileRight]] is undefined, attempt to move the file that ends at fileRight
     *   - set visited[out[fileRight]] = true
     *   - set id = out[fileRight]
     *   - set fileRange = []
     *   - find the start of the file: let fileLeft = fileRight
     *      - while out[fileLeft] === out[fileRight]
     *        - add fileLeft to start of fileRange
     *        - decrement fileLeft
     *   - we now have the indices of the file we want to move. first set these to "."
     * - now, search from left to right for empty sectors.
     *   - set emptyStart = 0
     *   - if out[emptyStart] !== ".", increment emptyStart
     *   - if out[emptyStart] === ".", we have found the start of an empty sector.
     *     - set emptyRange = []
     *     - if out[emptyStart] === ".":
     *       - add emptyStart to end of emptyRange
     *       - increment emptyStart
     *     - if out[emptyStart] !== ".":
     *       - check if emptyRange.length > fileRange.length. if yes:
     *         - for each index in fileRange, set out[index] = "."
     *         - for each index in emptyRange, set out[index] = id
     *         - we have moved the file to the empty sector. return to the top of the loop starting at fileRight
     **/

    const out = [...this.diskMap];
    const visited: { [key: string]: boolean } = {};

    let fileRight: number = out.length - 1;
    while (fileRight >= 0) {
      if (out[fileRight] === "." || visited[fileRight] === true) {
        fileRight--;
        continue;
      }

      const fileId = out[fileRight];
      const filePositions: number[] = [];
      let filePointer: number = fileRight;

      while (out[filePointer] === fileId) {
        filePositions.push(filePointer);
        filePointer--;
      }
      fileRight = filePointer;

      let emptyLeft: number = 0;
      while (emptyLeft <= fileRight) {
        if (out[emptyLeft] !== ".") {
          emptyLeft++;
          continue;
        }

        const emptyPositions: number[] = [];
        let emptyPointer: number = emptyLeft;
        while (out[emptyPointer] === ".") {
          emptyPositions.push(emptyPointer);
          emptyPointer++;
        }
        emptyLeft = emptyPointer;

        if (emptyPositions.length >= filePositions.length) {
          visited[out[fileId]] = true;
          while (filePositions.length > 0) {
            const nextFilePos = filePositions.shift();
            const nextEmptyPos = emptyPositions.shift();
            if (nextFilePos && nextEmptyPos) {
              out[nextFilePos] = ".";
              out[nextEmptyPos] = fileId;
            }
          }
          break;
        }
      }
    }

    this.wholeFileSystem = out;
  }

  get checksum(): number {
    return this.fileSystem.reduce((acc, curr, currIndex) => {
      if (curr === ".") {
        return acc;
      }
      return acc + Number(curr) * currIndex;
    }, 0);
  }

  get wholeFileChecksum(): number {
    return this.wholeFileSystem.reduce((acc, curr, currIndex) => {
      if (curr === ".") {
        return acc;
      }
      return acc + Number(curr) * currIndex;
    }, 0);
  }

  private setSolutions(): void {
    this.solutions["checksum"] = this.checksum;
    this.solutions["wholeFileChecksum"] = this.wholeFileChecksum;
  }
}
