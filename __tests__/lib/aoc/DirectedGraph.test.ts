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
});
