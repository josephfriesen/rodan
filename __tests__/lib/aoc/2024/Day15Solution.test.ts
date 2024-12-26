import Day15Solution from "@lib/aoc/2024/Day15Solution";
import Matrix from "@lib/aoc/Matrix";

const input: string = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

describe("Day 15 Solution", () => {
  let s: Day15Solution;

  beforeEach(() => {
    s = new Day15Solution(input);
  });

  it("should have DAY === 15", () => {
    expect(s.DAY).toBe(15);
  });

  it("should have matrix 'map' from input", () => {
    expect(s.map).toBeInstanceOf(Matrix);
    expect(s.map.entry(0, 0)).toBe("#");
    expect(s.map.entry(4, 4)).toBe("@");
  });

  it("should have method 'robotPosition' that gives the current position of the robot", () => {
    expect(s.robotPosition()).toEqual([4, 4]);
  });

  it("should have method 'moveRobot' that moves the robot in a given direction according to rules", () => {
    s.moveRobot("<");
    expect(s.robotPosition()).toEqual([4, 3]);
    s.moveRobot("<");
    expect(s.robotPosition()).toEqual([4, 2]);
    expect(s.map.entry(4, 1)).toEqual(s.BOX);
    s.moveRobot("<");
    expect(s.robotPosition()).toEqual([4, 2]);
    expect(s.map.entry(4, 1)).toEqual(s.BOX);
  });

  it("should have method executeAllInstructions that calls moveRobot for each instruction in order", () => {
    s.executeAllInstructions();
    expect(s.map.entry(1, 2)).toBe(s.BOX);
    expect(s.map.entry(1, 1)).toBe(s.EMPTY);
    expect(s.map.entry(4, 3)).toBe(s.ROBOT);
  });

  it("should have accessor sumOfBoxGPS that adds the GPS rating for all current box positions", () => {
    s.executeAllInstructions();
    expect(s.sumOfBoxGPS).toBe(10092);
  });

  it("should have attribute bigMap that makes extra-big boxes and walls", () => {
    expect(s.bigMap).toBeInstanceOf(Matrix);
    expect(s.bigMap.entry(0, 0)).toBe("#");
    expect(s.bigMap.entry(1, 1)).toBe("#");
  });

  describe("moveRobotBigMap", () => {
    it("should be defined", () => {
      expect(s.moveRobotBigMap).toBeDefined();
    });

    it("should behave as before if moving W or E", () => {
      s.moveRobotBigMap("<");
      expect(s.bigMap.entry(4, 5)).toBe("[");
      expect(s.bigMap.entry(4, 6)).toBe("]");
      expect(s.bigMap.entry(4, 7)).toBe("@");
    });

    it("should call method getMoveBlock to enumerate the positions of the robot and any boxes to be moved, or return null if moving would hit a wall", () => {
      s.moveRobotBigMap("<");
      expect(s.getMoveBlock(Matrix.DIRECTIONS.N)).toEqual(
        expect.arrayContaining([
          [4, 7],
          [3, 7],
          [3, 6],
        ])
      );
      s.bigMap.transpose([4, 7], [5, 6]);
      expect(s.getMoveBlock(Matrix.DIRECTIONS.N)).toEqual(
        expect.arrayContaining([
          [5, 6],
          [4, 6],
          [4, 5],
          [3, 4],
          [3, 5],
          [3, 6],
          [3, 7],
        ])
      );
      s.bigMap.transpose([5, 6], [2, 6]);
      expect(s.getMoveBlock(Matrix.DIRECTIONS.N)).toBe(null);
      expect(s.getMoveBlock(Matrix.DIRECTIONS.S)).toBe(null);
    });

    it("should return if getMoveBlock hit a wall at any point in the immediate neighbor of any robot or box cell", () => {
      s.bigMap.transpose([4, 8], [6, 5]);
      s.moveRobotBigMap("^");
      expect(s.robotPosition(s.bigMap)).toEqual([6, 5]);
      expect(s.bigMap.entry(5, 5)).toBe(s.WALL);
      s.bigMap.transpose([6, 5], [2, 7]);
      s.moveRobotBigMap("^");
      expect(s.robotPosition(s.bigMap)).toEqual([2, 7]);
      expect(s.bigMap.entry(1, 7)).toBe(s.BOXRIGHT);
    });

    it("should move all entries in getMoveBlock in the specified direction one space", () => {
      s.moveRobotBigMap("<");
      s.bigMap.transpose([4, 7], [5, 6]);
      s.moveRobotBigMap("^");
      expect(s.robotPosition(s.bigMap)).toEqual([4, 6]);
      expect(s.bigMap.entry(2, 4)).toBe(s.BOXLEFT);
      expect(s.bigMap.entry(3, 4)).toBe(s.EMPTY);
    });
  });

  it("should have method executeBigMapInstructions that executes each instruction on the fat map", () => {
    s.executeBigMapInstructions();
    expect(s.robotPosition(s.bigMap)).toEqual([7, 4]);
    expect(s.bigMap.entry(4, 10)).toBe(s.BOXLEFT);
    expect(s.bigMap.entry(4, 11)).toBe(s.BOXRIGHT);
  });

  it("should have accessor sumOfBigMapGPS that adds the GPS rating for all current box positions in the big map", () => {
    s.executeBigMapInstructions();
    expect(s.sumOfBigMapGPS).toBe(9021);
  });

  it("should diagnose this weird situation", () => {
    // the weird problem wasn't that weird, we were moving in the wrong order when direction = south.
    // fixed by reversing the order of the move block if moving south.
    const problemInputString: string = `####################
##[]..[]....[]..[]##
##[].......@..[]..##
##........[][][][]##
##....[]..[]..[]..##
##..##....[]......##
##...[].......[]..##
##.....[]..[].[][]##
##........[]......##
####################`;
    s.bigMap = new Matrix(
      problemInputString.split("\n").map((line) => line.split(""))
    );
    expect(s.getMoveBlock(Matrix.DIRECTIONS.S)).toEqual(
      expect.arrayContaining([
        [2, 11],
        [3, 10],
        [3, 11],
        [4, 10],
        [4, 11],
        [5, 10],
        [5, 11],
      ])
    );
    s.moveRobotBigMap("v");
    expect(s.robotPosition(s.bigMap)).toEqual([3, 11]);
    expect(s.bigMap.entry(3, 10)).toEqual(".");
    expect(s.bigMap.entry(6, 10)).toEqual("[");
    expect(s.bigMap.entry(6, 11)).toEqual("]");
  });
});
