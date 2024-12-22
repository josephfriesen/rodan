import { SolutionBuilder } from "../SolutionBuilder";
import Matrix, { CoordinatesType, EntryType } from "../Matrix";
import DirectedAcyclicGraph from "../DirectedAcyclicGraph";

export default class Day10Solution extends SolutionBuilder {
  map: Matrix;
  graph: DirectedAcyclicGraph;
  trailheads: Array<string>;
  trailtails: Array<string>;
  validPaths: Map<string, number>;
  pathRatings: Map<string, number>;

  constructor(input: string) {
    super(10, input);
    this.initializeMap();
    this.initializeTrailheads();
    this.initializeGraph();
    this.calcValidPaths();
    this.calcPathRatings();
    this.setSolutions();
  }

  private initializeMap(): void {
    this.map = new Matrix(
      this.input.split("\n").map((line) => line.split("").map((n) => Number(n)))
    );
  }

  private initializeTrailheads(): void {
    this.trailheads = this.map
      .allOccurencePositions(0)
      .map((coord) => JSON.stringify(coord));
    this.trailtails = this.map
      .allOccurencePositions(9)
      .map((coord) => JSON.stringify(coord));
  }

  private initializeGraph(): void {
    this.graph = new DirectedAcyclicGraph();
    for (let i = 0; i < this.map.height; i++) {
      for (let j = 0; j < this.map.width; j++) {
        const hereCoordinates: CoordinatesType = [i, j];
        const hereElevation: EntryType = this.map.entry(...hereCoordinates);
        const neighborhood: CoordinatesType[] = this.map.neighborhoodCardinal(
          ...hereCoordinates
        );
        for (const neighbor of neighborhood) {
          const [k, l] = neighbor as [number, number];
          if (hereElevation === (this.map.entry(k, l) as number) - 1) {
            this.graph.addEdge(
              JSON.stringify(hereCoordinates),
              JSON.stringify(neighbor)
            );
          }
        }
      }
    }
  }

  private calcValidPaths(): void {
    this.validPaths = new Map();
    for (const source of this.trailheads) {
      let count = 0;
      for (const dest of this.trailtails) {
        if (this.graph.pathExists(source, dest)) {
          count++;
        }
      }
      this.validPaths.set(source, count);
    }
  }

  get validPathsSum(): number {
    let sum = 0;
    for (const value of this.validPaths.values()) {
      sum += value;
    }
    return sum;
  }

  private setSolutions(): void {
    this.solutions["validPathsSum"] = this.validPathsSum;
    this.solutions["pathRatingsSum"] = this.pathRatingsSum;
  }

  private calcPathRatings(): void {
    this.pathRatings = new Map();
    for (const source of this.trailheads) {
      let sum = 0;
      for (const dest of this.trailtails) {
        sum += this.graph.countPaths(source, dest);
      }
      this.pathRatings.set(source, sum);
    }
  }

  get pathRatingsSum(): number {
    let sum = 0;
    for (const value of this.pathRatings.values()) {
      sum += value;
    }
    return sum;
  }
}
