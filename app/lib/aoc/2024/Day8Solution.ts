import { SolutionBuilder } from '../SolutionBuilder';
import Matrix from '../Matrix';
import Queue from '../Queue';

export default class Day8Solution extends SolutionBuilder {
  matrix: Matrix;
  nodeMap: Map<string, [number, number]> = new Map();
  uniqueAntinodes: Set<string> = new Set();
  extendedUniqueAntinodes: Set<string> = new Set();

  constructor(input) {
    super(8, input);
    this.initializeMatrix();
    this.initializeNodeMap();
    this.setUniqueAntinodes();
    this.setUniqueAntinodes(
      this.extendedUniqueAntinodes,
      this.getExtendedAntinodes,
    );
  }

  private initializeMatrix(): void {
    this.matrix = new Matrix(
      this.input
        .split('\n')
        .filter(Boolean)
        .map((line) => line.split('')),
    );
  }

  private initializeNodeMap(): void {
    for (const row of this.matrix.matrix) {
      for (const entry of row) {
        if (entry !== '.' && !this.nodeMap.has(entry)) {
          this.nodeMap.set(entry, this.matrix.allOccurencePositions(entry));
        }
      }
    }
  }

  static entryDistance(
    e: [number, number],
    f: [number, number],
  ): [number, number] {
    return [f[0] - e[0], f[1] - e[1]];
  }
  getAntinodes(
    e: [number, number],
    f: [number, number],
  ): Array<[number, number]> {
    const distance: [number, number] = Day8Solution.entryDistance(e, f);
    const fnode: [number, number] = [f[0] + distance[0], f[1] + distance[1]];
    const enode: [number, number] = [e[0] - distance[0], e[1] - distance[1]];
    return [
      this.matrix.inbounds(fnode) && fnode,
      this.matrix.inbounds(enode) && enode,
    ].filter(Boolean);
  }

  getExtendedAntinodes(
    e: [number, number],
    f: [number, number],
  ): Array<[number]> {
    const antinodes: Array<[number, number]> = [e, f];
    const distance: [number, number] = Day8Solution.entryDistance(e, f);
    let fnode = [f[0] + distance[0], f[1] + distance[1]];
    while (this.matrix.inbounds(fnode)) {
      antinodes.push(fnode);
      fnode = [fnode[0] + distance[0], fnode[1] + distance[1]];
    }

    let enode = [e[0] - distance[0], e[1] - distance[1]];
    while (this.matrix.inbounds(enode)) {
      antinodes.push(enode);
      enode = [enode[0] - distance[0], enode[1] - distance[1]];
    }

    return antinodes;
  }

  private setUniqueAntinodes(
    uniqueAntinodes: Set<[number, number]> = this.uniqueAntinodes,
    nodeCalc: (
      e: [number, number],
      f: [number, number],
    ) => Array<[number, number]> = this.getAntinodes,
  ): void {
    const getAntinodes = nodeCalc.bind(this);
    for (const coordinates of this.nodeMap.values()) {
      const entryQueue: Queue = new Queue();
      for (const c of coordinates) {
        entryQueue.enqueue(c);
      }

      while (!entryQueue.isEmpty()) {
        const current: [number, number] = entryQueue.dequeue();
        for (const comparison of entryQueue.list) {
          const antinodes: Array<[number, number]> = getAntinodes(
            current,
            comparison,
          );
          for (const antinode of antinodes) {
            uniqueAntinodes.add(antinode.toString());
          }
        }
      }
    }
  }

  get numUniqueAntinodes(): number {
    return this.uniqueAntinodes.size;
  }

  get numExtendedUniqueAntinodes(): number {
    return this.extendedUniqueAntinodes.size;
  }
}
