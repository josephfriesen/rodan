import WeightedGraph from "@lib/aoc/WeightedGraph";

describe("Weight Graph data structure", () => {
  let G: WeightedGraph;

  beforeEach(() => {
    G = new WeightedGraph();
    G.addWeightedEdge("A", "B", 3);
    G.addWeightedEdge("A", "C", 2);
    G.addWeightedEdge("B", "D", 2);
    G.addWeightedEdge("C", "D", 1);
    G.addWeightedEdge("C", "E", 4);
    G.addWeightedEdge("D", "E", 2);
  });

  it("should have array of weights for each vertex", () => {
    expect(G.weights).toBeInstanceOf(Map);
  });

  it("should have method 'vertexWeights' that retrieves the list of weights for edges at a given vertex", () => {
    expect(G.vertexWeights("A")).toBeInstanceOf(Map);
    expect(G.vertexWeights("A").get("B")).toBe(3);
  });

  it("should have method 'weight' that retrieves the weight of an edge between two vertices, or throws an error if edge does not exist", () => {
    expect(G.weight("A", "B")).toBe(3);

    const error = () => {
      G.weight("A", "E");
    };
    expect(error).toThrow(Error);
  });

  describe("Dijkstra's algorithm", () => {
    it("should implement Dijkstra's algorithm", () => {
      const { distances, previous } = G.Dijkstra("A");
      expect(distances["A"]).toBe(0);
      expect(distances["B"]).toBe(3);
      expect(distances["E"]).toBe(5);
      expect(previous["E"]).toBe("D");
      expect(previous["D"]).toBe("C");
      expect(previous["C"]).toBe("A");
    });

    it("should allow us to build the minimum-weight path between two vertices, if it exists", () => {
      expect(G.minWeightPath("A", "E")).toEqual(["A", "C", "D", "E"]);
    });

    it("should allow us to calulate the total weight of minimum-weight path between two vertices, if one exists", () => {
      expect(G.weightOfMinPath("A", "E")).toBe(5);
    });
  });
});
