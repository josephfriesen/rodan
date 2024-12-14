import { SolutionBuilder } from "../SolutionBuilder";

export class Day3Solution extends SolutionBuilder {
  products: Array<Array<number>>;
  instructions: Array<string>;
  instructedProducts: Array<Array<number>>;

  constructor(input: string) {
    super(3, input);
    this.products = [];
    this.instructions = [];
    this.instructedProducts = [];
    this.inputToProducts();
    this.inputToInstructions();
    this.instructionsToInstructedProducts();
  }

  private inputToProducts(): void {
    const regex = /mul\(\d+,\d+\)/g;
    const matches = this.input.matchAll(regex);
    for (const match of matches) {
      this.products.push(this.mulToNumbers(match[0]));
    }
  }

  private inputToInstructions(): void {
    const regex = /mul\(\d+,\d+\)|do\(\)|don\'t\(\)/g;
    const matches = this.input.matchAll(regex);
    for (const match of matches) {
      this.instructions.push(match[0]);
    }
  }

  private mulToNumbers(s: string): Array<number> {
    return s
      .replace("mul(", "")
      .replace(")", "")
      .split(",")
      .map((p) => Number(p));
  }

  private instructionsToInstructedProducts(): void {
    let go = true;
    for (const instruction of this.instructions) {
      if (instruction === "do()") {
        go = true;
        continue;
      }

      if (instruction === "don't()") {
        go = false;
        continue;
      }

      if (go === false) {
        continue;
      }

      this.instructedProducts.push(this.mulToNumbers(instruction));
    }
  }

  private calculateProduct(product: Array<number>): number {
    return product[0] * product[1];
  }

  get sumOfProducts(): number {
    return this.products.reduce(
      (acc, curr) => acc + this.calculateProduct(curr),
      0,
    );
  }

  get sumOfInstructedProducts(): number {
    return this.instructedProducts.reduce(
      (acc, curr) => acc + this.calculateProduct(curr),
      0,
    );
  }
}

export default Day3Solution;
