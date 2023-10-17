import { SolutionBuilder } from "./SolutionBuilder";

interface SplitInput {
  stackLines: Array<string>;
  instructionLines: Array<string>;
}

class Stack {
  top: number;
  data: Array<string>;
  identifier: string;

  constructor(stackLine: Array<string>) {
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
    while (top >= 0) {
      console.log(this.data[top]);
      top--;
    }
  }
}

class Day5Solution extends SolutionBuilder {
  stacksInput: Array<string>;
  instructionsInput: Array<string>;

  constructor(input: string) {
    super(5, input);

    const { stackLines, instructionLines } = this.splitInput();
    this.stacksInput = stackLines;
    this.instructionsInput = instructionLines;
  }

  private splitInput(): SplitInput {
    const lines = this.input.split("\n");
    return {
      stackLines: lines.slice(0, 9),
      instructionLines: lines.slice(10, lines.length - 1),
    };
  }

  private buildStacks() {
    console.log(this.stacksInput);
    console.log(this.crateBuilder(this.stacksInput[0]));
  }

  private crateBuilder(line: string) {
    // line: an individual line from this.stacksInput
    const queue = line.split("");
    console.log(queue);
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

  test() {
    this.buildStacks();
  }
}

export default Day5Solution;
