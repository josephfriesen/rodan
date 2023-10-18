import { SolutionBuilder } from "./SolutionBuilder";

interface SplitInput {
  stackLines: Array<string>;
  instructionLines: Array<string>;
}

class Stack {
  top: number;
  data: Array<string>;
  identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
    this.data = [];
    this.top = 0;
  }

  push(element: string): void {
    this.data[this.top] = element;
    this.top = this.top + 1;
  }

  length(): number {
    return this.top;
  }

  peek(): string {
    return this.data[this.top - 1];
  }

  isEmpty(): boolean {
    return this.top === 0;
  }

  pop(): string {
    if (this.isEmpty() === false) {
      this.top = this.top - 1;
      return this.data.pop();
    }
  }

  print(): void {
    let top = this.top - 1;
    let stackString = `Stack: ${this.identifier}  (top) == `;
    while (top >= 0) {
      stackString += `${this.data[top]} `;
      top--;
    }
    stackString += "== (bottom)";
    console.log(stackString);
  }

  get toString(): string {
    let top = this.top - 1;
    let stackString = "";
    while (top >= 0) {
      stackString += this.data[top];
      top--;
    }
    return stackString;
  }
}

export class Instruction {
  inputString: string;
  source: string;
  destination: string;
  total: number;
  stackIdentifiers: string[];

  constructor(instructionString: string, stackIdentifiers: string[]) {
    this.inputString = instructionString.trim();
    this.stackIdentifiers = stackIdentifiers;

    const splitStrings = instructionString.split(" ");
    this.total = parseInt(splitStrings[1]);
    this.source = splitStrings[3].trim();
    this.destination = splitStrings[5].trim();
  }

  get sourceValid(): boolean {
    if (!this.stackIdentifiers.includes(this.source)) {
      console.error("invalid source given to instruction");
      console.log(this);
      return false;
    }

    return true;
  }

  get destinationValid(): boolean {
    if (!this.stackIdentifiers.includes(this.destination)) {
      console.error("invalid destination given to instruction");
      console.log(this);
      return false;
    }

    return true;
  }

  get totalValid(): boolean {
    if (!Number.isInteger(this.total) || this.total < 0) {
      console.error("invalid count given to instruction");
      console.log(this);
      return false;
    }

    return true;
  }
}

class Day5Solution extends SolutionBuilder {
  stacksInput: Array<string>;
  instructionsInput: Array<string>;
  stacks: Map<string, Stack>;
  stackIdentifiers: Array<string>;
  currentExecutionStep: number;

  constructor(input: string) {
    super(5, input);

    this.initializer();
  }

  initializer(): void {
    const { stackLines, instructionLines } = this.splitInput();
    this.stacksInput = stackLines;
    this.instructionsInput = instructionLines;

    this.initStacks();
    this.populateStacks();
    this.currentExecutionStep = 1;
  }

  private splitInput(): SplitInput {
    // chop the input into arrays of lines in two parts, the initial state of the stacks and the
    // list of instructions to execute.
    const lines = this.input.split("\n");
    return {
      stackLines: lines.slice(0, 9),
      instructionLines: lines.slice(10, lines.length),
    };
  }

  private initStacks(): void {
    // initialize this.stacks and this.stackIdentifiers
    // this.stackIdentifiers: array of strings ["1", "2", ... , "9"]
    // this.stacks: Map with keys from stackIdentifiers and values each an empty stack
    const queue = [...this.stacksInput].reverse();
    const stackIdentifiers = queue[0]
      .split("")
      .map((s) => s.trim())
      .filter((str) => str.length > 0);
    this.stacks = new Map(stackIdentifiers.map((id) => [id, new Stack(id)]));
    this.stackIdentifiers = stackIdentifiers;
  }

  private populateStacks(): void {
    // process the stacks input lines, from the bottom up.
    // for each, create a stackMap from buildStackMaps, then proceess each map.
    // each entry in the map is a key-value pair, with key the stack to add the
    // crate to and value the crate to add.
    // should get this.stacks now initialized to the position given in the input.
    const queue = [...this.stacksInput].reverse();
    queue.splice(0, 1); // chop off the " 1  2  3  ..." line, don't need it
    const stackMaps: Map<string, string>[] = queue.map((line) =>
      this.buildStackMaps(line)
    );
    stackMaps.forEach((map) => {
      map.forEach((crate, identifier, _) => {
        const stack = this.getStack(identifier);
        stack.push(crate);
      });
    });
  }

  private buildStackMaps(line: string): Map<string, string> {
    // args: line => a single line from stacksInput (previously split by newline)
    // output: a map, with keys from the strings "1", "2", ... , "9"
    //   giving the stack to be added to, and values single letters giving
    //   the identifier for the crate located there.
    const queue = line.split("");
    const characterMap = new Map();
    let position = 1;
    let stringBuilder = "";
    queue.forEach((char, idx) => {
      const done = idx % 4 === 3;
      if (done || idx === queue.length - 1) {
        characterMap.set(position.toString(), stringBuilder);
        stringBuilder = "";
        position++;
      } else {
        stringBuilder += char;
      }
    });
    const crateMap = new Map(
      [...characterMap].filter(([_, value]) => value.trim() !== "")
    );
    const trimmedCrateMap = new Map(
      Array.from(crateMap, ([k, v]) => [k, v.replace("[", "").replace("]", "")])
    );
    return trimmedCrateMap;
  }

  getStack(id: string): Stack {
    try {
      if (!this.stackIdentifiers.includes(id)) {
        throw new Error(`invalid id, no stack exists with id ${id}`);
      }

      return this.stacks.get(id);
    } catch (err) {
      console.error(err);
    }
  }

  get currentInstruction(): Instruction {
    return new Instruction(
      this.instructionsInput[this.currentExecutionStep - 1],
      this.stackIdentifiers
    );
  }

  get currentSource(): Stack {
    return this.getStack(this.currentInstruction.source);
  }

  get currentDestination(): Stack {
    return this.getStack(this.currentInstruction.destination);
  }

  get currentMoveSize(): number {
    return this.currentInstruction.total;
  }

  // "executeCrateMover9000" and "executeCrateMover9001" is a terrible naming convention
  // don't blame me blame the elves.
  executeCrateMover9000(): void {
    let step = 1;
    while (step <= this.currentMoveSize) {
      const crate: string = this.currentSource.pop();
      this.currentDestination.push(crate);
      step++;
    }
  }

  executeInstructionsWithCrateMover9000(): void {
    while (this.currentExecutionStep <= this.instructionsInput.length) {
      this.executeCrateMover9000();
      this.currentExecutionStep++;
    }
  }

  executeCrateMover9001(): void {
    const moveQueue = [];
    let step = 1;
    while (step <= this.currentMoveSize) {
      const crate: string = this.currentSource.pop();
      moveQueue.push(crate);
      step++;
    }
    for (const crate of moveQueue.reverse()) {
      this.currentDestination.push(crate);
    }
  }

  executeInstructionsWithCrateMover9001(): void {
    while (this.currentExecutionStep <= this.instructionsInput.length) {
      this.executeCrateMover9001();
      this.currentExecutionStep++;
    }
  }

  printInstruction(instruction: Instruction): void {
    console.log("INSTRUCTION");
    console.log(`MOVE ${instruction.total} CRATES`);
    console.log(`  source: ${instruction.source}`);
    this.getStack(instruction.source).print();
    console.log(`  destination: ${instruction.destination}`);
    this.getStack(instruction.destination).print();
  }

  printStacks(): void {
    console.log(this.stackIdentifiers);
    for (const identifier of this.stackIdentifiers) {
      this.getStack(identifier).print();
    }
  }

  get stackTops(): string {
    let solution = "";
    for (const identifier of this.stackIdentifiers) {
      const stack = this.getStack(identifier);
      const char = stack.peek();
      if (char) {
        solution += char;
      }
    }
    return solution;
  }

  test() {
    // console.log(this.stacksInput);
    // console.log("Current stacks: ");
    // this.printStacks();
    // console.log(this.stackTops);
    // console.log("Attempting to execute all instructions..... NOW!");
    // this.executeAllInstructions();
    // console.log("Stacks after all moves: ");
    // this.printStacks();
    // console.log(this.stackTops);
    // console.log(`Solution: ${this.stackTops}`);
    // console.log(this);
    // console.log(this.stackIdentifiers);
    // console.log(this.stacks);
  }
}

export default Day5Solution;
