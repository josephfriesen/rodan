-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AocSolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "aocYearId" INTEGER NOT NULL,
    "aocPuzzleId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input" TEXT NOT NULL DEFAULT '',
    "solutionData" TEXT NOT NULL DEFAULT '{}',
    "isSolutionValid" BOOLEAN NOT NULL DEFAULT false,
    "solvedAt" DATETIME,
    "isTestData" BOOLEAN NOT NULL DEFAULT false,
    "isAocData" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/'
);
INSERT INTO "new_AocSolution" ("aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt") SELECT "aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt" FROM "AocSolution";
DROP TABLE "AocSolution";
ALTER TABLE "new_AocSolution" RENAME TO "AocSolution";
CREATE INDEX "AocSolution_aocYearId_idx" ON "AocSolution"("aocYearId");
CREATE INDEX "AocSolution_aocPuzzleId_idx" ON "AocSolution"("aocPuzzleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
