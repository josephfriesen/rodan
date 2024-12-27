import Queue from "@lib/aoc/Queue";
import Matrix from "@lib/aoc/Matrix";

export type VertexType = string | number;
export type NeighborhoodType = Array<VertexType>;

export default class SimpleGraph {
  vertices: VertexType[];
  neighborhoods: Map<VertexType, NeighborhoodType>;

  constructor() {
    this.vertices = [];
    this.neighborhoods = new Map();
  }

  addVertex(v: VertexType): void {
    if (this.vertexExists(v)) {
      throw new Error(`vertex ${v} already exists on graph`);
    }
    this.vertices.push(v);
    this.neighborhoods.set(v, []);
  }

  vertex(v: VertexType): VertexType | null {
    if (!this.vertexExists(v)) {
      return null;
    }
    return this.vertices.find((u) => u === v) || null;
  }

  vertexExists(v: VertexType): boolean {
    return this.vertices.includes(v);
  }

  neighborhood(v: VertexType): NeighborhoodType {
    const neighborhood = this.neighborhoods.get(v);
    if (!neighborhood) {
      throw new Error(`Neighborhood not found for vertex ${v}`);
    }
    return neighborhood;
  }

  edgeExists(u: VertexType, v: VertexType): boolean {
    return this.neighborhood(u).includes(v) && this.neighborhood(v).includes(u);
  }

  addEdge(u: VertexType, v: VertexType): void {
    if (!this.vertexExists(u)) {
      this.addVertex(u);
    }
    if (!this.vertexExists(v)) {
      this.addVertex(v);
    }
    if (this.edgeExists(u, v)) {
      return;
    }
    this.neighborhood(u).push(v);
    this.neighborhood(v).push(u);
  }

  getVertices(): VertexType[] {
    return this.vertices;
  }

  getNeighborhoods(): Map<VertexType, NeighborhoodType> {
    return this.neighborhoods;
  }

  get order(): number {
    return this.vertices.length;
  }

  degree(v: VertexType): number | null {
    const vertex = this.vertex(v);
    if (!vertex) {
      return null;
    }
    const length = this.neighborhood(vertex)?.length;
    return length !== undefined ? length : null;
  }

  degreeSum(): number {
    let sum = 0;
    for (const vertex of this.vertices) {
      sum += this.degree(vertex) as number;
    }
    return sum;
  }

  BFS(v: VertexType, cb: (u: VertexType) => any): void {
    if (!this.vertex(v)) {
      return;
    }

    const visited: { [key: VertexType]: boolean } = {};
    const queue: Queue = new Queue();
    queue.enqueue(v);
    while (!queue.isEmpty()) {
      const current: VertexType = queue.dequeue() as VertexType;
      if (visited[current]) {
        continue;
      }
      visited[current] = true;
      cb(current);
      const neighborhood: NeighborhoodType = this.neighborhood(current);
      for (const neighbor of neighborhood.values()) {
        if (!visited[neighbor]) {
          queue.enqueue(neighbor);
        }
      }
    }
  }

  DFS(
    v: VertexType,
    cb: (...args: any[]) => any,
    ...additionalArgs: any[]
  ): void {
    const search = (
      current: VertexType,
      visit: { [key: VertexType]: boolean }
    ): void => {
      visit[current] = true;
      cb(current, ...additionalArgs);
      const neighborhood: NeighborhoodType = this.neighborhood(current);
      for (const neighbor in neighborhood.values()) {
        if (!visited[neighbor]) {
          search(neighbor, visit);
        }
      }
    };

    const visited: { [key: VertexType]: boolean } = {};
    search(v, visited);
  }

  getComponents(): Array<Array<VertexType>> {
    const components: Array<Array<VertexType>> = [];
    let vertexList = this.getVertices();
    while (vertexList.length > 0) {
      const component: VertexType[] = [];
      const processVertex = (v: VertexType) => {
        component.push(v);
        vertexList = vertexList.filter((u) => u !== v);
      };

      this.BFS(vertexList[0], processVertex);
      components.push(component);
    }
    return components;
  }

  adjacencyMatrix(): Matrix {
    return new Matrix(
      this.vertices.map((v) => {
        const row: VertexType[] = Array(this.order).fill(0);
        const neighborhood: NeighborhoodType = this.neighborhood(v);
        this.vertices.forEach((u, index) => {
          if (neighborhood.includes(u)) {
            row[index] = 1;
          }
        });
        return row;
      })
    );
  }

  printGraph(): string {
    const vertices: VertexType[] = this.getVertices();
    let outputString: string = "";
    for (const v of vertices) {
      const neighborhood = this.neighborhood(v);
      let neighborsString: string = "";
      for (const u of neighborhood.values()) {
        neighborsString += `${u} `;
      }
      // console.log(`vertex (${v}) => [${neighborsString.trim()}]`); // eslint-disable-line no-console
      outputString += `vertex (${v}) => [${neighborsString.trim()}]\n`;
    }
    return outputString;
  }
}
