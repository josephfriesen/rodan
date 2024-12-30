import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Matrix, { CoordinatesType } from "@lib/aoc/Matrix";
import SimpleGraph, { VertexType } from "../SimpleGraph";
import math from "mathjs";

export default class Day20Solution extends SolutionBuilder {
  map: Matrix;
  START: CoordinatesType;
  END: CoordinatesType;
  cheatCells: CoordinatesType[];
  G: SimpleGraph;
  path: VertexType[];

  constructor(input: string) {
    super(20, input);
    this.buildMap();
    this.findCheatCells();
    this.buildGraphs();
    this.findPath();
  }

  private buildMap(): void {
    this.map = new Matrix(this.input.split("\n").map((line) => line.split("")));
    const start = this.map.find("S");
    const end = this.map.find("E");
    if (!start || !end) {
      throw new Error("start/end not defined, is matrix build correctly?");
    }

    this.START = start;
    this.END = end;
  }

  isOnPath(c: CoordinatesType): boolean {
    if (c === null) return false;
    const valid: any[] = [".", "S", "E"];
    return valid.includes(this.map.entry(c[0], c[1]));
  }

  get innerWalls(): CoordinatesType[] {
    return this.map
      .allOccurencePositions("#")
      .filter((m) => m !== null)
      .filter((m) => m[0] !== 0 && m[1] !== 0);
  }

  private findCheatCells(): void {
    this.cheatCells = this.innerWalls.filter((m) => {
      if (m === null) return false;
      return (
        (this.isOnPath(this.map.traversal(m, "N")) &&
          this.isOnPath(this.map.traversal(m, "S"))) ||
        (this.isOnPath(this.map.traversal(m, "E")) &&
          this.isOnPath(this.map.traversal(m, "W")))
      );
    });
  }

  vertToCell(vertex: VertexType): CoordinatesType {
    return JSON.parse(vertex as string);
  }

  cellToVert(coords: CoordinatesType): VertexType {
    return JSON.stringify(coords);
  }

  get u(): VertexType {
    return this.cellToVert(this.START);
  }

  get v(): VertexType {
    return this.cellToVert(this.END);
  }

  private buildGraphs(): void {
    this.G = new SimpleGraph();
    const coordSet: CoordinatesType[] = [
      this.START,
      ...this.map.allOccurencePositions("."),
      this.END,
    ];

    const isGEdge = (neighbor: CoordinatesType): boolean => {
      return (
        this.G.vertexExists(this.cellToVert(neighbor)) &&
        this.isOnPath(neighbor)
      );
    };
    for (const c of coordSet) {
      this.addVertex(this.G, c, isGEdge);
    }
  }

  addVertex(
    G: SimpleGraph,
    c: CoordinatesType,
    edgeDecision: (c: CoordinatesType) => boolean
  ): void {
    if (!c || !Array.isArray(c)) {
      throw new TypeError("c is not valid coordinate pair");
    }
    const [i, j] = c;
    const cVert: VertexType = this.cellToVert(c);
    G.addVertex(cVert);
    for (const neighbor of this.map.neighborhoodCardinal(i, j)) {
      const nVert: VertexType = this.cellToVert(neighbor);
      if (edgeDecision(neighbor)) {
        G.addEdge(cVert, nVert);
      }
    }
  }

  private findPath(): void {
    const path: VertexType[] | null = this.G.shortestPath(this.u, this.v);
    if (path === null) {
      throw new Error("path not found from start to end, is this.G correct?");
    }
    this.path = path;
  }

  get long(): number {
    return this.path.length;
  }

  cellScore(c: CoordinatesType): number {
    if (this.cellToVert(c) === this.u) {
      return this.long + 1;
    }
    return this.path.slice(this.path.indexOf(this.cellToVert(c))).length;
  }

  cheatSavings(c: CoordinatesType): number {
    if (c === null) {
      throw new TypeError("invalid coordinates pair");
    }

    let i: CoordinatesType;
    let j: CoordinatesType;

    const N = this.map.traversal(c, "N");
    const S = this.map.traversal(c, "S");
    const E = this.map.traversal(c, "E");
    const W = this.map.traversal(c, "W");

    if (this.isOnPath(N) && this.isOnPath(S)) {
      i = N;
      j = S;
    } else if (this.isOnPath(E) && this.isOnPath(W)) {
      i = E;
      j = W;
    } else {
      throw new Error(
        `failed to find an adequate entrance/exit vertex pair for cheatCell ${c}`
      );
    }

    return Math.abs(this.cellScore(i) - this.cellScore(j)) - 2;
  }

  countGoodCheats(threshold: number = 100) {
    return this.cheatCells.reduce((count, cell) => {
      if (this.cheatSavings(cell) >= threshold) {
        return count + 1;
      }
      return count;
    }, 0);
  }

  // part 2

  cheatBetweenPoints(
    a: CoordinatesType,
    b: CoordinatesType,
    MAX: number = 20
  ): number {
    const dist: number = this.map.manhattanDistance(a, b);

    if (dist > MAX) {
      return 0;
    }

    const cheatedLength: number = this.cellScore(b) + dist;
    return this.cellScore(a) - cheatedLength;
  }

  countBetterCheats(threshold: number = 100, MAX: number = 20) {
    // slow, takes around 50 seconds for a full input, but works
    let count: number = 0;
    const augmentedPath: VertexType[] = [this.u, ...this.path];
    for (let i = 0; i < augmentedPath.length - 1; i++) {
      const a: CoordinatesType = this.vertToCell(augmentedPath[i]);
      for (let j = i + 1; j < augmentedPath.length; j++) {
        const b: CoordinatesType = this.vertToCell(augmentedPath[j]);
        const cheatSavings: number = this.cheatBetweenPoints(a, b, MAX);
        if (cheatSavings >= threshold) {
          count++;
        }
      }
    }

    return count;
  }
}
