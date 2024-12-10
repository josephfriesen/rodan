import { SolutionBuilder } from "../SolutionBuilder";

type SafetyReport = {
  report: Array<number>;
  isIncreasing: boolean;
  isSafe: boolean;
  isSafeWithFaultTolerance: boolean;
};

export class Day2Solution extends SolutionBuilder {
  safetyReports: Array<SafetyReport>;

  constructor(input: string) {
    super(2, input);

    this.safetyReports = [];
    this.inputToSafetyReports();
  }

  inputToSafetyReports(): void {
    const chunked: Array<string> = this.input.split("\n");
    for (const chunk of chunked) {
      const report: SafetyReport = this.parseStringToSafetyReport(chunk);
      this.safetyReports.push(report);
    }
  }

  parseStringToSafetyReport(string: string): SafetyReport {
    const report = string.split(" ").map(Number);
    const safetyReport = {
      report,
      isSafe: false,
      isSafeWithFaultTolerance: false,
      isIncreasing: false,
    };
    safetyReport.isIncreasing = safetyReport.report[0] < safetyReport.report[1];
    safetyReport.isSafe = this.determineIfSafe(safetyReport);
    safetyReport.isSafeWithFaultTolerance =
      this.determineSafeWithSingleFaultRemoval(safetyReport);
    return safetyReport;
  }

  determineIfSafe(safetyReport: SafetyReport): boolean {
    /* mark a report as safe or unsafe.
     * a report is safe if:
     * 1. all numbers are either increasing or decreasing
     * 2. the difference between any two consecutive numbers is at least one and at most three
     * we take pairwise elements from the report and compare them, and stop if we find a pair
     * that violates the above.
     */
    let safe = true;
    for (let i = 1; i <= safetyReport.report.length - 1; i++) {
      const prev = safetyReport.report[i - 1];
      const curr = safetyReport.report[i];
      let diff = curr - prev;
      if (!safetyReport.isIncreasing) {
        diff = diff * -1;
      }
      if (diff > 3 || diff < 1) {
        safe = false;
        break;
      }
    }
    return safe;
  }

  determineSafeWithSingleFaultRemoval(safetyReport: SafetyReport): boolean {
    /* mark a report as safe with fault tolerance or unsafe.
     * a report is safe with fault tolerance if:
     * 1. the report itself is safe (previously determined in determineIfSafe)
     * 2. there exists an element in the report such that removing that element results in a safe report.
     * we check by brute force: for each element, remove it, and check if the resulting report is safe.
     * if so, stop and return true, else continue to the next element. if no element is found, return false.
     */
    if (safetyReport.isSafe) {
      return true;
    }

    const originalReport = [...safetyReport.report];
    for (let i = 0; i < originalReport.length; i++) {
      const removed = [
        ...originalReport.slice(0, i),
        ...originalReport.slice(i + 1),
      ];
      const newReport = this.parseStringToSafetyReport(removed.join(" "));
      if (newReport.isSafe) {
        return true;
      }
    }

    return false;
  }

  get totalSafe(): number {
    return this.safetyReports.filter(
      (safetyReport: SafetyReport) => safetyReport.isSafe
    ).length;
  }

  get totalSafeWithFaultTolerance(): number {
    return this.safetyReports.filter(
      (safetyReport: SafetyReport) => safetyReport.isSafeWithFaultTolerance
    ).length;
  }

  test(): void {
    const TESTS_DAY1 = [
      { report: [1, 2, 3, 4, 5], expected: true },
      { report: [5, 4, 3, 2, 1], expected: true },
      { report: [1, 2, 6, 7, 8], expected: false },
      { report: [1, 2, 3, 2, 4], expected: false },
      { report: [8, 7, 6, 2, 1], expected: false },
      { report: [8, 6, 5, 8, 7], expected: false },
      { report: [1, 2, 4, 5, 5], expected: false },
      { report: [1, 2, 1, 2, 3], expected: false },
      { report: [1, 2, 2, 2, 3], expected: false },
      { report: [6, 5, 4, 1, 2], expected: false },
    ];

    const TESTS_DAY2 = [
      { report: "7 6 4 2 1", expected: true },
      { report: "1 2 7 8 9", expected: false },
      { report: "9 7 6 2 1", expected: false },
      { report: "1 3 2 4 5", expected: true },
      { report: "8 6 4 4 1", expected: true },
      { report: "1 3 6 7 9", expected: true },
    ];

    console.log(`[part 1, this.totalSafe === 606]: ${this.totalSafe === 606}`);

    console.log(
      `[part 2: this.totalSafeWithFaultTolerance]: ${this.totalSafeWithFaultTolerance}`
    );

    for (const TEST of TESTS_DAY2) {
      console.log(
        `[report]: ${TEST.report}, [expected]: ${TEST.expected}, [actual]: ${this.determineSafeWithSingleFaultRemoval(this.parseStringToSafetyReport(TEST.report))}`
      );
    }
  }
}

export default Day2Solution;
