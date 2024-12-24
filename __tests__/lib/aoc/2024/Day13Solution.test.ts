import Day13Solution from "@lib/aoc/2024/Day13Solution";

const input = `Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`;

describe("Day 13 Solution", () => {
  let s: Day13Solution;

  beforeEach(() => {
    s = new Day13Solution(input);
  });

  it("should have DAY === 13", () => {
    expect(s.DAY).toBe(13);
  });

  it("should have attribute ClawPuzzles, which is an array of puzzle inputs parsed from the input string", () => {
    expect(s.ClawPuzzles.length).toBeGreaterThan(0);
    expect(s.ClawPuzzles[0].A).toBeDefined();
  });

  it("should have solvePuzzle method that takes ClawPuzzle as argument, sets up linear system, solves it, and returns ClawPuzzle with solution info", () => {
    expect(s.ClawPuzzles[0].valid).toBe(true);
    expect(s.ClawPuzzles[0].solution).toEqual({ A: 80, B: 40 });
    expect(s.ClawPuzzles[0].tokens).toEqual(280);
    expect(s.ClawPuzzles[1].valid).toBe(false);
    expect(s.ClawPuzzles[2].valid).toBe(true);
    expect(s.ClawPuzzles[2].solution).toEqual({ A: 38, B: 86 });
    expect(s.ClawPuzzles[2].tokens).toEqual(200);
    expect(s.ClawPuzzles[3].valid).toBe(false);
  });

  it("should have accessor tokensSpent that gets the number of tokens spent for all solvable puzzles", () => {
    expect(s.tokensSpent).toBe(480);
  });

  it("should have attribute BigClawPuzzles, that takes the prize positions of the original claw puzzles and increases the X and Y values by 10000000000000", () => {
    expect(s.BigClawPuzzles[0].P.x).toEqual(
      s.ClawPuzzles[0].P.x + 10000000000000
    );
    expect(s.BigClawPuzzles[0].P.y).toEqual(
      s.ClawPuzzles[0].P.y + 10000000000000
    );
  });

  it("should have BigClawPuzzles solved accordingly", () => {
    expect(s.BigClawPuzzles[0].valid).toBe(false);
    expect(s.BigClawPuzzles[1].valid).toBe(true);
    expect(s.BigClawPuzzles[2].valid).toBe(false);
    expect(s.BigClawPuzzles[3].valid).toBe(true);
  });

  it("should have accessor tokensSpentOnBigClawGames", () => {
    expect(s.tokensSpentOnBigClawGames).toBe(875318608908);
  });
});
