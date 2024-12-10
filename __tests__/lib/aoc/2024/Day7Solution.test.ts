import Day7Solution from "@solutions2024/Day7Solution";

describe("Day 7 Solution", () => {
  let solution: Day7Solution;

  beforeEach(() => {
    const input = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;

    solution = new Day7Solution(input);
  });

  it("should have DAY == 7", () => {
    expect(solution.DAY).toEqual(7);
  });

  it("should have input", () => {
    expect(solution.input).toBeDefined();
  });

  it("should have a list of calibrations based on the lines of the input", () => {
    expect(solution.calibrations[0]).toEqual({
      goal: 190,
      inputs: [10, 19],
      operations: 1,
    });
    expect(solution.calibrations[7]).toEqual({
      goal: 21037,
      inputs: [9, 7, 18, 13],
      operations: 3,
    });
  });

  it("should have method binaryOperations that takes in a string of length n with each character = '0', '1', or '2', and returns an n-length oarray of binary operations ADD, MULT or CONCAT", () => {
    expect(solution.binaryOperations).toBeDefined();

    const inputString: string = "201";
    const operations = solution.binaryOperations(inputString);
    expect(operations.length).toEqual(3);
    for (const op of operations) {
      expect(typeof op).toBe("function");
    }

    expect(operations[0](2, 4)).toEqual(24); // inputString[0] = 2 => operations[0] = CONCAT
    expect(operations[1](2, 4)).toEqual(6); // inputString[1] = 0 => operations[1] = ADD
    expect(operations[2](2, 4)).toEqual(8); // inputString[2] = 1 => operations[2] = MULT
  });

  it("should have a method binaryStrings that gives all the binary strings of length n", () => {
    expect(solution.binaryStrings).toBeDefined();
    expect(() => {
      solution.binaryStrings(-1);
    }).toThrow(Error);
    expect(solution.binaryStrings(1).length).toBe(2 ** 1);
    expect(solution.binaryStrings(1)).toEqual(
      expect.arrayContaining(["0", "1"])
    );
    expect(solution.binaryStrings(2).length).toBe(2 ** 2);
    expect(solution.binaryStrings(2)).toEqual(
      expect.arrayContaining(["00", "01", "10", "11"])
    );
    expect(solution.binaryStrings(3).length).toBe(2 ** 3);
    expect(solution.binaryStrings(3)).toEqual(
      expect.arrayContaining(["000", "001", "010", "100", "101", "110", "111"])
    );
  });

  it("should have a method checkCalibrationValidity to determine if there is a possible series of consecutive binary operations such that after applying operations to inputs we obtain goal", () => {
    expect(solution.checkCalibrationValidity(solution.calibrations[0])).toBe(
      true
    );

    expect(solution.checkCalibrationValidity(solution.calibrations[1])).toBe(
      true
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[2])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[3])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[4])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[5])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[6])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[7])).toBe(
      false
    );
    expect(solution.checkCalibrationValidity(solution.calibrations[8])).toBe(
      true
    );
  });

  it("should have an accessor validCalibrationsSum that return the sum of all valid calibrations", () => {
    expect(solution.validCalibrationsSum).toEqual(3749);
  });

  it("should have an accessor validCalibrationsWithConcatSum that returns the sum of all valid calibrations with available operations ADD, MULT and CONCAT", () => {
    expect(solution.validCalibrationsWithConcatSum).toBeDefined();
    expect(solution.validCalibrationsWithConcatSum).toEqual(11387);
  });
});
