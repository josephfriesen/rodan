import SimpleGraph, { VertexType, NeighborhoodType } from "./SimpleGraph";

type WeightsType = Map<VertexType, number>;
type DijkstraType = {
  previous: { [key: VertexType]: VertexType };
  distances: { [key: VertexType]: number };
};

export default class WeightedGraph extends SimpleGraph {
  weights: Map<VertexType, WeightsType>;

  constructor() {
    super();
    this.weights = new Map();
  }

  addVertex(v: VertexType): void {
    if (this.vertexExists(v)) {
      return;
    }
    this.vertices.push(v);
    this.neighborhoods.set(v, []);
    this.weights.set(v, new Map());
  }

  vertexWeights(v: VertexType): WeightsType {
    if (!this.vertexExists(v)) {
      throw new Error(`vertex ${v} does not exist on graph`);
    }
    const weights = this.weights.get(v);
    if (!weights) {
      throw new Error(
        `graph is ill-defined, weights for vertex ${v} does not exist`
      );
    }
    return weights;
  }

  addWeightedEdge(u: VertexType, v: VertexType, w: number) {
    if (w === undefined || w < 0) {
      throw new Error("edge weight must be non-negative number");
    }
    this.addEdge(u, v);
    this.vertexWeights(u).set(v, w);
    this.vertexWeights(v).set(u, w);
  }

  weight(u: VertexType, v: VertexType): number {
    if (!this.edgeExists(u, v)) {
      throw new Error("u,v is not an edge in graph");
    }
    return this.vertexWeights(u).get(v) || Infinity;
  }

  Dijkstra(u: VertexType): {
    distances: { [key: VertexType]: number };
    previous: { [key: VertexType]: VertexType };
  } {
    let queue: VertexType[] = [];
    const distances = {};
    const previous = {};
    for (const vertex of this.vertices) {
      queue.push(vertex);
      distances[vertex] = Infinity;
    }
    distances[u] = 0;

    while (queue.length > 0) {
      queue = queue.sort((x, y) => {
        return distances[x] - distances[y];
      });
      const current: VertexType = queue.shift() as VertexType;
      const neighbors: NeighborhoodType = this.neighborhood(current);
      for (const neighbor of neighbors) {
        const newDistance = distances[current] + this.weight(current, neighbor);
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = current;
        }
      }
    }

    return { distances, previous };
  }

  minWeightPath(u: VertexType, v: VertexType): VertexType[] {
    const dijkstra: DijkstraType = this.Dijkstra(u);
    let current = v;
    const path: VertexType[] = [v];
    while (current !== u) {
      current = dijkstra.previous[current];
      path.unshift(current);
    }
    return path;
  }

  weightOfMinPath(u: VertexType, v: VertexType): number {
    return this.Dijkstra(u).distances[v];
  }
}
