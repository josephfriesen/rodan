import { SolutionBuilder } from "@lib/aoc/SolutionBuilder";
import Matrix, { CoordinatesType } from "@lib/aoc/Matrix";
import SimpleGraph from "@lib/aoc/SimpleGraph";
import fs from "fs";
import * as path from "path";

type Robot = {
  id: number;
  initialPosition: CoordinatesType;
  currentPosition: CoordinatesType;
  endPosition?: CoordinatesType;
  vector: CoordinatesType;
};

export default class Day14Solution extends SolutionBuilder {
  // the test input and live puzzle input operate on different size matrices: the test input is a
  // 11x7 matrix but live input is 101x103 matrix. account for this by adding M and N paramters to constructor
  M: number; // width
  N: number; // height
  Robots: Robot[];

  constructor(input: string, m: number, n: number) {
    super(14, input);
    this.M = m;
    this.N = n;
    this.initializeRobots();
  }

  private initializeRobots(): void {
    this.Robots = [];
    const lines = this.input.split("\n");
    let i: number = 0;
    for (const line of lines) {
      const initMatch: RegExpMatchArray | null = line.match(/p=\d+,\d+/g);
      if (!initMatch) {
        throw new Error("error parsing input, no match for initial position");
      }
      const initCoords: string[] = initMatch[0].replace("p=", "").split(",");
      const initialPosition: CoordinatesType = [
        Number(initCoords[1]),
        Number(initCoords[0]),
      ];
      const vectMatch: RegExpMatchArray | null = line.match(/v=-?\d+,-?\d+/g);
      if (!vectMatch) {
        throw new Error("error parsing input, no match for vector");
      }
      const vectCoords: string[] = vectMatch[0].replace("v=", "").split(",");
      const vector: CoordinatesType = [
        Number(vectCoords[1]),
        Number(vectCoords[0]),
      ];
      this.Robots.push({
        id: i++,
        initialPosition,
        currentPosition: initialPosition,
        vector,
      });
    }
  }

  moveRobot(
    position: CoordinatesType,
    vector: CoordinatesType
  ): CoordinatesType {
    if (!position || !vector) {
      throw new Error("error moving robot, no starting position or vector");
    }
    return [
      this.mod(position[0] + vector[0], this.N),
      this.mod(position[1] + vector[1], this.M),
    ];
  }

  resetRobots(): void {
    for (const robot of this.Robots) {
      robot.currentPosition = robot.initialPosition;
    }
  }

  moveAllRobotsNSteps(n: number): void {
    for (const robot of this.Robots) {
      let pos: CoordinatesType = robot.currentPosition;
      for (let i = 1; i <= n; i++) {
        pos = this.moveRobot(pos, robot.vector);
      }
      robot.currentPosition = pos;
    }
  }

  get robotsByPosition(): Map<string, number> {
    const map: Map<string, number> = new Map();
    for (const robot of this.Robots) {
      const { currentPosition } = robot;
      const key = JSON.stringify(currentPosition);
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }

  get robotsByQuadrant(): [number, number, number, number] {
    const X: number = (this.M - 1) / 2; // can trust inputs are constructed such that M,N are odd and this is an integer
    const Y: number = (this.N - 1) / 2;
    const quads = { I: 0, II: 0, III: 0, IV: 0 };
    const [I, II, III, IV]: string[] = ["I", "II", "III", "IV"];
    const map: Map<string, number> = this.robotsByPosition;
    for (const [key, count] of map.entries()) {
      const [y, x] = JSON.parse(key) as [number, number];
      if (x < X && y < Y) {
        quads[I] = quads[I] + count;
      }
      if (x > X && y < Y) {
        quads[II] = quads[II] + count;
      }
      if (x > X && y > Y) {
        quads[III] = quads[III] + count;
      }
      if (x < X && y > Y) {
        quads[IV] = quads[IV] + count;
      }
    }
    return Object.values(quads) as [number, number, number, number];
  }

  get safetyFactor(): number {
    return this.robotsByQuadrant.reduce((acc, curr) => acc * curr, 1); // this will be 0 if there is any empty quadrant
  }

  setSolutions(): void {
    this.moveAllRobotsNSteps(100);
    this.solutions["safetyFactor"] = this.safetyFactor;
    this.resetRobots();
  }

  matrix(): Matrix {
    const input: Array<number[]> = [];
    for (let i = 0; i < this.N; i++) {
      const row: number[] = Array(this.M).fill(0);
      input.push(row);
    }
    const matrix: Matrix = new Matrix(input);
    for (const [key, count] of this.robotsByPosition) {
      const parsed = JSON.parse(key);
      matrix.insertEntry(parsed, count);
    }
    return matrix;
  }

  printClean(m: Matrix): string {
    return m.matrix
      .map((row) => row.map((entry) => (entry === 0 ? " " : entry)).join(""))
      .join("\n");
  }

  graph(): SimpleGraph {
    const m = this.matrix();
    const graph: SimpleGraph = new SimpleGraph();
    for (let i = 0; i < m.height; i++) {
      for (let j = 0; j < m.width; j++) {
        if (m.entry(i, j) !== 0) {
          graph.addVertex(`[${i},${j}]`);
        }
      }
    }
    for (const vertex of graph.getVertices()) {
      const coordinates = JSON.parse(vertex);
      const mapNeighborhood = m.neighborhoodAll(coordinates[0], coordinates[1]);
      for (const mNeighbor of mapNeighborhood) {
        const neighbor = JSON.stringify(mNeighbor);
        if (graph.vertexExists(neighbor)) {
          graph.addEdge(vertex, neighbor);
        }
      }
    }
    return graph;
  }

  ySymmetryScore(): number {
    const graph = this.graph();
    const YAxis: number = (this.N - 1) / 2;
    let symmetryCount = 0;
    for (const vertex of graph.getVertices()) {
      const parsed = JSON.parse(vertex);
      const row = parsed[0];
      const column = parsed[1];
      const distance = YAxis - column;
      if (graph.vertexExists(JSON.stringify([row, YAxis + distance]))) {
        symmetryCount++;
      }
    }
    return symmetryCount;
  }

  maxYSymmetryScore(): { y: number; i: number } {
    // first attempt: find the matrix with unusually high number of entries with symmetry about the y-axis, on the
    // assumption that the christmas tree will be located exactly in the middle of the matrix.
    // this works, but takes about twice as long as checking average degree in a simple graph
    // (4 minutes to calculate y-symmetries for 10000 iterations)
    let maxY = 0;
    let maxYIteration = 0;
    for (let i = 0; i <= 10000; i++) {
      const ySym = this.ySymmetryScore();
      if (ySym > maxY) {
        maxY = ySym;
        maxYIteration = i;
      }
      this.moveAllRobotsNSteps(1);
    }
    return { y: maxY, i: maxYIteration }; // { y: 123, i: 7344 }
  }

  maxDegree(): { max: number; iteration: number } {
    let max = 0;
    let iteration = 0;

    for (let i = 0; i <= 10000; i++) {
      const g: SimpleGraph = this.graph();
      const degreeAvg = g.degreeSum() / g.getVertices().length;
      if (degreeAvg > max) {
        max = degreeAvg;
        iteration = i;
      }

      this.moveAllRobotsNSteps(1);
    }
    return { max, iteration }; // { max: 3.692, iteration: 7344 }
  }

  printPositions(): void {
    /*
     * for checking the output of the various methods we tried to find the outlier iteration,
     * writes to file in /tmp directory
     */
    const filepath = path.resolve(`${process.cwd()}/tmp/day14.txt`);
    fs.writeFile(filepath, `${new Date()}\n\n\n`, (err) => {
      if (err) throw err;
    });

    this.resetRobots();
    const { max, iteration } = this.maxDegree();
    this.moveAllRobotsNSteps(iteration);
    const matrix = this.matrix();
    let outputString = `\n===================\n\n`;
    outputString += `[max]: ${max}\n`;
    outputString += `[iteration]: ${iteration}\n`;
    outputString += `[matrix]: \n\n`;
    outputString += `${this.printClean(matrix)}\n\n`;

    fs.appendFile(
      path.resolve(`${process.cwd()}/tmp/day14.txt`),
      outputString,
      (err) => {
        if (err) throw err;
      }
    );
    /*
===================

[max]: 3.692
[iteration]: 7344
[matrix]: 

                                                             1  1                                    
                                                      1                                              
     1  1                                          1 1                                               
                                                                                                     
                                                                                                     
                        1                                             1  1                           
                                                                                                     
  1        1                                 1                                                       
                          1                                                                          
                                                                        1             1              
      1 1                                                                                            
                                        1                                                            
   1                                                        1                                        
                                                                                                     
                               1                   1                                                 
                                                                        1         1                  
                                                                                 1                   
                           1                                                                         
  1                                                                    1       1          1          
            1                                                                                        
          1           1                  1111111111111111111111111111111                       1     
                                         1                             1  1                          
  1                                  1   1                             1                             
                                 1       1                             1                             
                                         1                             1               1             
                                         1              1              1                             
                                         1             111             1                        1    
                                         1            11111            1                             
                            1 1          1           1111111           1           1                 
                                         1          111111111          1           1                 
   1                                1    1            11111            1                             
                   1                     1           1111111           1                   1         
                         1               1          111111111          1  1        1                 
                                         1         11111111111         1                             
                                         1        1111111111111        1                1            
 1             1      1                  1          111111111          1                             
                                         1         11111111111         1                             
                                         1        1111111111111        1                             
                                         1       111111111111111       1             1               
               1                         1      11111111111111111      1                             
  1           1              1           1        1111111111111        1                             
                                         1       111111111111111       1        1               1    
         1       1                       1      11111111111111111      1                             
                                         1     1111111111111111111     1           1                 
                                         1    111111111111111111111    1                             
                           1             1             111             1                             
                                  1      1             111             1                             
                                         1             111             1                             
                                    1    1                             1                             
                                  1   1  1                             1          1            1     
                                         1                             1                             
                  1                      1                             1              1 1          1 
           1                             1111111111111111111111111111111             1    1          
     1          1       1                                                      1                     
                                                                                            1   1    
                                1                   1                                                
                                           1                                                    1    
                                                                                                     
                                                              1               1                      
           1                                                                                         
                                                                                                     
                                                                           1                1        
 1         1                                           1                                             
                                                                                                   1 
                    1                                                            1       1           
                                                                                                 1   
     1                                                                                               
                1                                       1                                            
                   1                                              1                              1   
                                                                         1                           
                   1 1                                                                         1     
                                            1                                                        
                                 1                                                                   
                        1                                                                            
                                                  1                                                  
    1                                                                                                
                                           1                                                         
                                                                                                     
                                                                                              1      
                                 1       1                                                           
                           1                                                      1                  
                                                                                                     
                                                                                                     
                                                                                                     
1                                                                                                    
                            1                                                        1               
         1                                1                                                  1       
                                                                  1                                  
                       1         1                                                             1     
                                                                                                     
                     1                                                                               
                                1                                                                    
                                                                                                     
       1                                                                                        1    
                                                           1       1                                 
                                                1                                                    
               1                                                                                    1
                                     1                                                               
                                                         1                                           
                                                                                   1                 
                                                                                                     
                                                                  1                                  
                                                                                                     

    */
  }
}
