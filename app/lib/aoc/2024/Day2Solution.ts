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
}

export default Day2Solution;
