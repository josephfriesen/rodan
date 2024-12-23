import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Matrix, { CoordinatesType, EntryType } from "@lib/aoc/Matrix";
import SimpleGraph, {
  VertexType,
  NeighborhoodType,
} from "@lib/aoc/SimpleGraph";

export default class Day12Solution extends SolutionBuilder {
  map: Matrix;
  graph: SimpleGraph;
  regions: Array<Array<VertexType>>;

  constructor(input) {
    super(12, input);
    this.initializeMap();
    this.initializeGraph();
    this.initializeRegions();
  }

  private initializeMap(): void {
    this.map = new Matrix(this.input.split("\n").map((line) => line.split("")));
  }

  private initializeGraph(): void {
    this.graph = new SimpleGraph();
    for (let i = 0; i < this.map.height; i++) {
      for (let j = 0; j < this.map.width; j++) {
        const mapCoordinates: CoordinatesType = [i, j];
        const vertex = JSON.stringify(mapCoordinates);
        if (!Array.isArray(mapCoordinates)) {
          throw new Error("huh?");
        }
        if (!this.graph.vertex(vertex)) {
          this.graph.addVertex(vertex);
        }

        const entry = this.map.entry(...mapCoordinates);
        const cardinalMapPositions = this.map.neighborhoodCardinal(
          ...mapCoordinates
        );

        for (const pos of cardinalMapPositions) {
          if (!Array.isArray(pos)) {
            throw new Error("huh?!?");
          }

          const nextdoorNeighbor = this.map.entry(...pos);
          if (entry === nextdoorNeighbor) {
            this.graph.addEdge(vertex, JSON.stringify(pos));
          }
        }
      }
    }
  }

  private initializeRegions(): void {
    this.regions = this.graph.getComponents();
  }

  private vertexToCoordinates(vertex: VertexType): [number, number] {
    return JSON.parse(vertex as string);
  }

  regionCrop(region: Array<VertexType>): EntryType {
    return this.map.entry(...this.vertexToCoordinates(region[0]));
  }

  regionArea(region: Array<VertexType>): number {
    return region.length;
  }

  regionPerimeter(region: Array<VertexType>): number {
    let count = 0;
    for (const vertex of region) {
      const mapNeighbors = this.map.neighborhoodCardinal(
        ...this.vertexToCoordinates(vertex)
      );
      count += 4 - mapNeighbors.length; // account for entries on map on boundary, which will not have out-of-bound neighbors
      for (const neighbor of mapNeighbors) {
        if (!this.graph.edgeExists(vertex, JSON.stringify(neighbor))) {
          count++;
        }
      }
    }
    return count;
  }

  regionFenceCost(region: Array<VertexType>): number {
    return this.regionArea(region) * this.regionPerimeter(region);
  }

  get totalFencingCost(): number {
    return this.regions.reduce(
      (acc, curr) => acc + this.regionFenceCost(curr),
      0
    );
  }

  corners(v: VertexType): number {
    // if (this.graph.degree(v) === 0) return 4;

    const coord: CoordinatesType = this.vertexToCoordinates(v);
    const N: VertexType = JSON.stringify(this.map.coordinatesN(...coord));
    const S: VertexType = JSON.stringify(this.map.coordinatesS(...coord));
    const E: VertexType = JSON.stringify(this.map.coordinatesE(...coord));
    const W: VertexType = JSON.stringify(this.map.coordinatesW(...coord));
    const NW: VertexType = JSON.stringify(this.map.coordinatesNW(...coord));
    const NE: VertexType = JSON.stringify(this.map.coordinatesNE(...coord));
    const SW: VertexType = JSON.stringify(this.map.coordinatesSW(...coord));
    const SE: VertexType = JSON.stringify(this.map.coordinatesSE(...coord));

    const nw = () => {
      if (!this.graph.edgeExists(v, N) && !this.graph.edgeExists(v, W))
        return true;
      if (this.graph.edgeExists(v, N) && this.graph.edgeExists(v, W))
        return !this.graph.edgeExists(N, NW);
      return false;
    };

    const ne = () => {
      if (!this.graph.edgeExists(v, N) && !this.graph.edgeExists(v, E))
        return true;
      if (this.graph.edgeExists(v, N) && this.graph.edgeExists(v, E))
        return !this.graph.edgeExists(N, NE);
      return false;
    };

    const se = () => {
      if (!this.graph.edgeExists(v, S) && !this.graph.edgeExists(v, E))
        return true;
      if (this.graph.edgeExists(v, S) && this.graph.edgeExists(v, E))
        return !this.graph.edgeExists(S, SE);
      return false;
    };

    const sw = () => {
      if (!this.graph.edgeExists(v, S) && !this.graph.edgeExists(v, W))
        return true;
      if (this.graph.edgeExists(v, S) && this.graph.edgeExists(v, W))
        return !this.graph.edgeExists(S, SW);
      return false;
    };

    const corners = [nw(), ne(), se(), sw()];
    const total = corners.filter(Boolean).length;
    return total;
  }

  regionBulkPerimeter(region: VertexType[]): number {
    return region.reduce(
      (accumulator: number, currentValue: VertexType) =>
        accumulator + this.corners(currentValue),
      0
    );
  }

  regionBulkFencingCost(region: VertexType[]): number {
    return this.regionArea(region) * this.regionBulkPerimeter(region);
  }

  get totalDiscountedFencingCost(): number {
    return this.regions.reduce(
      (acc, curr) => acc + this.regionBulkFencingCost(curr),
      0
    );
  }

  setSolutions(): void {
    this.solutions["totalFencingCost"] = this.totalFencingCost;
  }
}
