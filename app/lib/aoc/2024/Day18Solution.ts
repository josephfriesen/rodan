import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Matrix, { CoordinatesType } from "@lib/aoc/Matrix";
import SimpleGraph, { VertexType } from "@lib/aoc/SimpleGraph";

export default class Day18Solution extends SolutionBuilder {
  dim: number;
  map: Matrix;

  constructor(input: string, dim: number) {
    super(18, input);
    this.dim = dim;
    this.buildMatrix();
  }

  private vertexToCoords(vertex: VertexType): CoordinatesType {
    return JSON.parse(vertex);
  }

  private coordsToVertex(coords: CoordinatesType): VertexType {
    return JSON.stringify(coords);
  }

  private getSectors(): CoordinatesType[] {
    return this.input
      .split("\n")
      .map((s) => s.split(",").map(Number).reverse());
  }

  buildMatrix(): void {
    this.map = new Matrix(
      Array.from(Array(this.dim), (_) => Array(this.dim).fill(".")) // eslint-disable-line @typescript-eslint/no-unused-vars
    );
  }

  corruptedSectors(n: number): Matrix {
    const m: Matrix = this.map.clone();
    const sectors: CoordinatesType[] = this.getSectors();
    for (let i = 0; i < n; i++) {
      m.insertEntry(sectors[i], "#");
    }
    return m;
  }

  buildGraph(map: Matrix): SimpleGraph {
    const G = new SimpleGraph();
    for (let i = 0; i < map.height; i++) {
      for (let j = 0; j < map.width; j++) {
        const coords: CoordinatesType = [i, j];
        if (map.entry(i, j) === ".") {
          G.addVertex(this.coordsToVertex(coords));
        }
      }
    }

    for (const vertex of G.getVertices()) {
      const coords: CoordinatesType = this.vertexToCoords(vertex);
      if (coords === null) {
        throw new Error("how did we get a vertex with null coordinates?");
      }
      const mapNeighbors: CoordinatesType[] = map.neighborhoodCardinal(
        coords[0],
        coords[1]
      );
      for (const mapNeighbor of mapNeighbors) {
        const neighbor: VertexType = this.coordsToVertex(mapNeighbor);
        if (G.vertexExists(neighbor)) {
          G.addEdge(vertex, neighbor);
        }
      }
    }
    return G;
  }

  shortestPathAfterCorruption(n: number): number | null {
    const map: Matrix = this.corruptedSectors(n);
    const graph: SimpleGraph = this.buildGraph(map);
    const path: VertexType[] | null = graph.shortestPath(
      "[0,0]",
      `[${this.dim - 1},${this.dim - 1}]`
    );
    if (path === null) {
      return null;
    }
    return path.length;
  }

  // part 2
  getFirstCutVertex(): CoordinatesType {
    // pretty slow, takes about 2 minutes.
    // searching from disconnection to connection still faster than from connection to
    // first disconnection, starting from connected graph starts at worst-case scenario:
    // (|V| = dim^2, |E| = 4*dim^2, single search time complexity O((|V|*|E|)*log(|V|))
    const sectors: CoordinatesType[] = this.getSectors();
    const sectorsLength = sectors.length;
    let cutVertex: CoordinatesType = null;

    for (let n = sectorsLength; n >= 0; n--) {
      const path: number | null = this.shortestPathAfterCorruption(n);
      if (path === null) {
        this.log(`corrupted ${n} sectors, graph disconnected`);
      } else {
        cutVertex = sectors[n];
        break;
      }
    }

    if (!cutVertex) {
      throw new Error("cut vertex not found");
    }
    return cutVertex;
  }
}
