import SimpleGraph from "@lib/aoc/SimpleGraph";
import Matrix from "@lib/aoc/Matrix";

describe("Simple Graph data structure", () => {
  let graph: SimpleGraph;
  let petersenGraph: SimpleGraph;

  beforeEach(() => {
    graph = new SimpleGraph();
    graph.addEdge("A", "B");
    graph.addEdge("A", "D");
    graph.addEdge("A", "E");
    graph.addEdge("B", "C");
    graph.addEdge("C", "E");
    graph.addEdge("C", "F");
    graph.addEdge("D", "E");
    graph.addEdge("E", "F");

    petersenGraph = new SimpleGraph();
    for (let i = 1; i <= 10; i++) {
      petersenGraph.addVertex(i);
    }
    petersenGraph.addEdge(1, 2);
    petersenGraph.addEdge(1, 6);
    petersenGraph.addEdge(2, 3);
    petersenGraph.addEdge(2, 7);
    petersenGraph.addEdge(3, 4);
    petersenGraph.addEdge(3, 8);
    petersenGraph.addEdge(4, 5);
    petersenGraph.addEdge(4, 9);
    petersenGraph.addEdge(5, 1);
    petersenGraph.addEdge(5, 10);
    petersenGraph.addEdge(6, 8);
    petersenGraph.addEdge(8, 10);
    petersenGraph.addEdge(10, 7);
    petersenGraph.addEdge(7, 9);
    petersenGraph.addEdge(9, 6);
  });

  it("has an adjacency matrix", () => {
    expect(petersenGraph.adjacencyMatrix()).toBeInstanceOf(Matrix);
  });

  it("has method 'degree' to give the degree of a vertex", () => {
    expect(
      petersenGraph.degree(Math.floor(Math.random() * (10 - 1 + 1)) + 1)
    ).toBe(3);
  });

  describe("SimpleGraph.BFS", () => {
    it("should traverse an empty graph", () => {
      const graph = new SimpleGraph();
      const callback = jest.fn();
      graph.BFS("non-existent-vertex", callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("should traverse a graph with a single vertex", () => {
      const graph = new SimpleGraph();
      graph.addVertex("A");
      const callback = jest.fn();
      graph.BFS("A", callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("A");
    });

    it("should traverse a graph with multiple vertices and edges", () => {
      const graph = new SimpleGraph();
      graph.addEdge("A", "B");
      graph.addEdge("A", "C");
      graph.addEdge("B", "D");
      graph.addEdge("C", "D");
      const callback = jest.fn();
      graph.BFS("A", callback);
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenCalledWith("A");
      expect(callback).toHaveBeenCalledWith("B");
      expect(callback).toHaveBeenCalledWith("C");
      expect(callback).toHaveBeenCalledWith("D");
    });

    it("should traverse a graph with disconnected components", () => {
      const graph = new SimpleGraph();
      graph.addEdge("A", "B");
      graph.addEdge("C", "D");
      const callback = jest.fn();
      graph.BFS("A", callback);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith("A");
      expect(callback).toHaveBeenCalledWith("B");
      expect(callback).not.toHaveBeenCalledWith("C");
      expect(callback).not.toHaveBeenCalledWith("D");
    });

    it("should call the callback function for each vertex", () => {
      const graph = new SimpleGraph();
      graph.addEdge("A", "B");
      graph.addEdge("A", "C");
      const callback = jest.fn((vertex) => {
        expect(["A", "B", "C"]).toContain(vertex);
      });
      graph.BFS("A", callback);
      expect(callback).toHaveBeenCalledTimes(3);
    });
  });

  it("should be able to enumerate all connected components", () => {
    expect(graph.getComponents()).toEqual([graph.getVertices()]);
    const disconnected = new SimpleGraph();
    disconnected.addEdge("A", "B");
    disconnected.addEdge("C", "D");
    expect(disconnected.getComponents()).toEqual([
      ["A", "B"],
      ["C", "D"],
    ]);
    const singleton = new SimpleGraph();
    singleton.addVertex("A");
    expect(singleton.getComponents()).toEqual([["A"]]);
  });
});
