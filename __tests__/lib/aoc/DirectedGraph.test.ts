import DirectedGraph from "@lib/aoc/DirectedGraph";

describe("DirectedGraph", () => {
  let graph: DirectedGraph;

  beforeEach(() => {
    graph = new DirectedGraph();
  });

  it("should create an empty graph", () => {
    expect(graph.getNodes().size).toBe(0);
  });

  it("should add an edge to the graph", () => {
    graph.addEdge("A", "B");
    expect(graph.getNodes().size).toBe(2);
    expect(graph.getNodes().has("A")).toBe(true);
    expect(graph.getNodes().has("B")).toBe(true);
  });

  it("should remove an edge from the graph", () => {
    graph.addEdge("A", "B");
    graph.removeEdge("A", "B");
    expect(graph.getNodes().size).toBe(2);
    expect(graph.getNodes().has("A")).toBe(true);
    expect(graph.getNodes().has("B")).toBe(true);
  });

  it("should get the nodes of the graph", () => {
    graph.addEdge("A", "B");
    graph.addEdge("B", "C");
    expect(graph.getNodes().size).toBe(3);
    expect(graph.getNodes().has("A")).toBe(true);
    expect(graph.getNodes().has("B")).toBe(true);
    expect(graph.getNodes().has("C")).toBe(true);
  });

  it("should get the in-degrees of the graph", () => {
    graph.addEdge("A", "B");
    graph.addEdge("C", "B");
    expect(graph.getInDegrees().get("B")).toBe(2);
    expect(graph.getInDegrees().get("A")).toBe(0);
    expect(graph.getInDegrees().get("C")).toBe(0);
  });

  it("should get the out-degrees of the graph", () => {
    graph.addEdge("A", "B");
    graph.addEdge("A", "C");
    expect(graph.getOutDegrees().get("A")).toBe(2);
    expect(graph.getOutDegrees().get("B")).toBe(0);
    expect(graph.getOutDegrees().get("C")).toBe(0);
  });

  it("should get the weights for a node", () => {
    graph.addEdge("A", "B", 2);
    graph.addEdge("A", "C", 3);
    expect(graph.getWeights("A")).toBeInstanceOf(Map);
    expect(graph.getWeights("A").get("B")).toBe(2);
    expect(graph.getWeights("A").get("C")).toBe(3);
    expect(graph.getWeights("B")).toBeInstanceOf(Map);
    expect(graph.getWeights("B").get("A")).toBeUndefined();
  });

  it("should get the weight for an edge", () => {
    graph.addEdge("A", "B", 2);
    graph.addEdge("A", "C", 3);
    expect(graph.getWeight("A", "B")).toBe(2);
    expect(graph.getWeight("A", "C")).toBe(3);
    expect(graph.getWeight("B", "A")).toBeUndefined();
  });

  describe("DFS", () => {
    it("should visit all nodes in a connected graph", () => {
      const graph = new DirectedGraph();
      graph.addEdge("A", "B");
      graph.addEdge("B", "C");

      const stack = [];
      const visited = {};
      graph.DFS("A", visited, stack);

      expect(visited).toEqual({ A: true, B: true, C: true });
    });

    it("should not visit nodes that are not reachable", () => {
      const graph = new DirectedGraph();
      graph.addEdge("A", "B");

      const stack = [];
      const visited = {};
      graph.DFS("A", visited, stack);

      expect(visited).toEqual({ A: true, B: true });
    });

    it("should handle cycles in the graph", () => {
      const graph = new DirectedGraph();
      graph.addEdge("A", "B");
      graph.addEdge("B", "C");
      graph.addEdge("C", "A");

      const stack = [];
      const visited = {};
      graph.DFS("A", visited, stack);

      expect(visited).toEqual({ A: true, B: true, C: true });
    });

    it("should handle multiple connected components", () => {
      const graph = new DirectedGraph();
      graph.addEdge("A", "B");
      graph.addEdge("C", "D");

      const stack = [];
      const visited = {};
      graph.DFS("A", visited, stack);

      expect(visited).toEqual({ A: true, B: true });
    });
  });

  describe("Dijkstra", () => {
    it("should implement Dijkstra's algorithm", () => {
      const graph = new DirectedGraph();

      const [A, B, C, D, E, F] = ["A", "B", "C", "D", "E", "F"];
      graph.addEdge(A, B, 3);
      graph.addEdge(A, C, 2);
      graph.addEdge(A, D, 4);
      graph.addEdge(B, D, 2);
      graph.addEdge(C, D, 1);
      graph.addEdge(C, E, 4);
      graph.addEdge(D, A, 2);
      graph.addEdge(E, D, 2);
      graph.addEdge(F, B, 4);

      const { distances, previous } = graph.Dijkstra("A");

      expect(distances[A]).toBe(0);
      expect(distances[B]).toBe(3);
      expect(distances[C]).toBe(2);
      expect(distances[D]).toBe(3);
      expect(distances[E]).toBe(6);
      expect(distances[F]).toBe(Infinity);
      expect(previous[A]).toBe(undefined);
      expect(previous[B]).toBe(A);
      expect(previous[C]).toBe(A);
      expect(previous[D]).toBe(C);
      expect(previous[E]).toBe(C);
      expect(previous[F]).toBe(undefined);
    });
  });

  describe("edge reversal", () => {
    beforeEach(() => {
      graph.addEdge("A", "B", 1);
      graph.addEdge("B", "C", 1000);
      graph.addEdge("C", "D", 5);
      graph.addEdge("D", "A", 10);
    });

    it("should be able to reverse an edge", () => {
      expect(graph.getNode("A")?.has("B")).toBe(true);
      expect(graph.getNode("B")?.has("A")).toBe(false);
      expect(graph.getWeights("A").get("B")).toBe(1);
      expect(graph.getWeights("B").get("A")).toBeUndefined();

      graph.reverseEdge("A", "B");
      graph.reverseEdge("B", "C");

      expect(graph.getNodes().size).toBe(4);
      expect(graph.getNode("A")?.has("B")).toBe(false);
      expect(graph.getNode("B")?.has("A")).toBe(true);
      expect(graph.getWeights("A").get("B")).toBeUndefined();
      expect(graph.getWeights("B").get("A")).toBe(1);
      expect(graph.getWeights("B").get("C")).toBeUndefined();
      expect(graph.getWeights("C").get("B")).toBe(1000);
    });

    it("should generate a cloned graph with all edges reversed", () => {
      const reversed = graph.cloneReversed();

      expect(reversed.getNode("A")?.has("B")).toBe(false);
      expect(reversed.getNode("B")?.has("A")).toBe(true);
      expect(reversed.getWeights("A").get("B")).toBeUndefined();
      expect(reversed.getWeights("B").get("A")).toBe(1);

      expect(reversed.getNode("B")?.has("C")).toBe(false);
      expect(reversed.getNode("C")?.has("B")).toBe(true);
      expect(reversed.getWeights("B").get("C")).toBeUndefined();
      expect(reversed.getWeights("C").get("B")).toBe(1000);

      expect(reversed.getNode("C")?.has("D")).toBe(false);
      expect(reversed.getNode("D")?.has("C")).toBe(true);

      expect(reversed.getNode("D")?.has("A")).toBe(false);
      expect(reversed.getNode("A")?.has("D")).toBe(true);
    });
  });
});
