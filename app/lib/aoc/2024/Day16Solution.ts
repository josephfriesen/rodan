import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import DirectedGraph from "@lib/aoc/DirectedGraph";
import Matrix, { CoordinatesType } from "@lib/aoc/Matrix";

export default class Day16Solution extends SolutionBuilder {
  M: Matrix;
  G: DirectedGraph;
  H: DirectedGraph;
  start: CoordinatesType;
  end: CoordinatesType;

  constructor(input: string) {
    super(16, input);
    this.buildMatrix();
    this.buildGraph();
    this.buildReverse();
  }

  buildMatrix(): void {
    this.M = new Matrix(this.input.split("\n").map((line) => line.split("")));
    const start = this.M.find("S");
    const end = this.M.find("E");
    if (start === undefined || end === undefined) {
      throw new Error("could not find entries for start or end");
    }
    this.start = start;
    this.end = end;
  }

  static OPPOSITES = {
    [Matrix.DIRECTIONS.N]: Matrix.DIRECTIONS.S,
    [Matrix.DIRECTIONS.S]: Matrix.DIRECTIONS.N,
    [Matrix.DIRECTIONS.W]: Matrix.DIRECTIONS.E,
    [Matrix.DIRECTIONS.E]: Matrix.DIRECTIONS.W,
  };

  vertexToCoordinates(vertex: string): [number, number, string] {
    const params = vertex
      .split(",")
      .map((st) => st.replace("(", "").replace(")", ""));
    const point = [Number(params[0]), Number(params[1])];
    const dir = params[2];
    return [point[0], point[1], dir];
  }

  coordinatesToVertex(i: number, j: number, dir: string): string {
    return `(${i},${j},${dir})`;
  }

  buildGraph(): void {
    // our graph this.G is a weighted graph.
    // our vertex set consistes of a string that encodes a state of traversing through the matrix.
    // our state consists of a position [i,j], and the direction we traveled to get to [i,j].
    // example: suppose we start at the starting position [13,1], and we travel north to [12, 1].
    // the vertex is the string "(12,1,N)".
    // our edge set is a pair of possible transitions between states.
    // for example, let u="(13,1,W)" and v="(12,1,N)".
    // this means that we would have previously arrived at u by traversing from [13,2] in the W direction.
    // the edge uv would suggest that we went from the state (13,1,W) to (12,1,N):
    // starting at the node [13,1] (from the W direction), we arrived at the node [12,1] (from the N direction).
    // we attach a weight > 0 to the edge uv. if the direction of traversal is a straight line,
    // meaning we by traversing in one direction and continued on that direction, the weight is 1.
    // if we made a 90 degree turn, (e.g. the direction started as W and ended as N), the weight is 1001.
    //
    // TO START: at this point we don't want S and E to be treated any differently than any other empty entry.
    // write "." into those positions in the matrix, and write S, E into those positions at the end.
    this.M.insertEntry(this.start, ".");
    this.M.insertEntry(this.end, ".");
    this.G = new DirectedGraph();

    const points = this.M.allOccurencePositions(".");

    const { N, W, S, E } = Matrix.DIRECTIONS;
    const DIRECTIONS = [N, W, S, E];

    // build vertex set
    for (const point of points) {
      if (point === null) {
        continue;
      }

      for (const IN_DIR of DIRECTIONS) {
        /* construct vertex string (pos[0],pos[1],dir), where dir is the possible in-directions.
         * e.g suppose we have point [3,4] in our matrix, the points [3,3] and [3,5] are walls, and
         * the points [2,4] and [4,4] are valid moves (entries equal to "." in the matrix).
         * then we will process the vertices (3,4,N) and (3,4,S), to indicate the possible states
         * at which we could have previously arrived at (3,4):
         *    (3,4,N): we arrived at (3,4) traversing N from (4,4)
         *    (3,4,S): we arrived at (3,4) traversing S from (2,4)
         */
        const neighbor = this.M.traverseEntry(
          point,
          Day16Solution.OPPOSITES[IN_DIR]
        );
        if (neighbor !== ".") {
          continue;
        }
        const vertex = this.coordinatesToVertex(point[0], point[1], IN_DIR);
        this.G.addVertex(vertex);
      }
    }

    for (const node of this.G.getNodes().keys()) {
      const [i, j, dir] = this.vertexToCoordinates(node as string);
      const OUT_DIRS = DIRECTIONS.filter(
        (d) => d !== Day16Solution.OPPOSITES[dir]
      );
      for (const OUT_DIR of OUT_DIRS) {
        const neighborCoords = this.M.traversal([i, j], OUT_DIR);
        const neighbor = this.M.traverseEntry([i, j], OUT_DIR);
        if (neighborCoords === null || neighbor !== ".") {
          continue;
        }
        const vertex = this.coordinatesToVertex(
          neighborCoords[0],
          neighborCoords[1],
          OUT_DIR
        );
        const weight = dir === OUT_DIR ? 1 : 1001;
        this.G.addEdge(node, vertex, weight);
      }
    }

    this.M.insertEntry(this.start, "S");
    this.M.insertEntry(this.end, "E");
  }

  minWeight(startDirection: string = "W"): number {
    /* pretty slow, takes 7-8 seconds to run with live input. most likely want to optimize graph.Dijkstra */
    if (!this.start || !this.end) {
      throw new Error("start or end undefined");
    }

    let startVertex = this.coordinatesToVertex(
      this.start[0],
      this.start[1],
      startDirection
    );
    let offset = 0;

    if (!this.G.getNodes().has(startVertex)) {
      throw new Error("start vertex not found");
    }

    if (this.G.getOutDegrees().get(startVertex) === 0) {
      const { N, W, S, E } = Matrix.DIRECTIONS;
      const DIRECTIONS = [N, E, S, W];
      for (const dir of DIRECTIONS) {
        if (this.M.traverseEntry([this.start[0], this.start[1]], dir) === ".") {
          const coords = this.M.traversal([this.start[0], this.start[1]], dir);
          if (!coords) {
            throw new Error("could not find valid coordinates");
          }
          startVertex = this.coordinatesToVertex(coords[0], coords[1], dir);
        }
      }
      offset = 1001;
    }

    const dijkstra = this.G.Dijkstra(startVertex);

    const vertices: string[] = [];
    for (const vertex of this.G.getNodes().keys()) {
      const regex = new RegExp(`\\(${this.end[0]},${this.end[1]},[NSWE]\\)`);
      if (regex.test(vertex as string)) {
        vertices.push(vertex as string);
      }
    }

    const minWeight = Math.min(...vertices.map((v) => dijkstra.distances[v]));
    return minWeight + offset;
  }

  /* part 2
   * in part 1, we found the value of a minimal-weight path from start vertex s to end vertex e in this.G
   * to be the value returned by this.minWeight := N.
   * consider a vertex v in this.G, not equal to s or e.
   * v lies on a minimal-weight path from s to e if and only if dist(s, v) + dist(v, e) = N.
   * (1) let optimalSeats = Set(s, e)
   * (2) build a directed graph H with edges of G reversed.
   * (3) for each vertex v in G\{s, e}:
   *     - dG(v) := this.G.Dijkstra(s).distances[v]
   *     - dH(v) := this.H.Dijkstra(e).distances[v]
   *     - d(v) = dG(v) + dH(v)
   *     - if d(v) === N, optimalSeats.add(v)
   * (4) return optimalSeats.size
   */
  buildReverse(): void {
    this.H = this.G.cloneReversed();
  }

  optimalSeats(start: string = "W"): Set<string> {
    const START = start;
    const optimalSeats = new Set<string>();
    const minWeight = this.minWeight(START);

    if (!this.start || !this.end) {
      throw new Error("start or end undefined");
    }

    const startVertex = this.coordinatesToVertex(
      this.start[0],
      this.start[1],
      START // start vertex direction?
    );
    const endVertex = this.coordinatesToVertex(
      this.end[0],
      this.end[1],
      "N" // end vertex direction?
    );

    const distancesFromStart = this.G.Dijkstra(startVertex).distances;
    const distancesFromEnd = this.H.Dijkstra(endVertex).distances;

    for (const vertex of this.G.getNodes().keys()) {
      const dG = distancesFromStart[vertex];
      const dH = distancesFromEnd[vertex];
      const d = dG + dH;
      if (d === minWeight) {
        const coords: [number, number, string] = this.vertexToCoordinates(
          vertex as string
        );
        const seat: string = JSON.stringify([coords[0], coords[1]]);
        if (!optimalSeats.has(seat)) {
          optimalSeats.add(seat);
        }
      }
    }

    return optimalSeats;
  }

  printOptimalSeats(start: string = "W"): void {
    const map = this.M.clone();
    const optimalSeats = this.optimalSeats(start);
    for (const seat of optimalSeats) {
      map.insertEntry(JSON.parse(seat), "O");
    }
    this.log(map.toString());
  }

  // solutions
  setSolutions(START: string): void {
    this.solutions["minCostPath"] = this.minWeight(START);
    this.solutions["numberOfOptimalSeats"] = this.optimalSeats(START).size;
  }
}
