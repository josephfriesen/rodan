-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AocPuzzle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalUrl" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/',
    "aocYearId" INTEGER NOT NULL
);
INSERT INTO "new_AocPuzzle" ("aocYearId", "createdAt", "day", "externalUrl", "id", "updatedAt", "url") SELECT "aocYearId", "createdAt", "day", "externalUrl", "id", "updatedAt", "url" FROM "AocPuzzle";
DROP TABLE "AocPuzzle";
ALTER TABLE "new_AocPuzzle" RENAME TO "AocPuzzle";
CREATE INDEX "AocPuzzle_aocYearId_idx" ON "AocPuzzle"("aocYearId");
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
    "explanation" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_AocSolution" ("aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt") SELECT "aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt" FROM "AocSolution";
DROP TABLE "AocSolution";
ALTER TABLE "new_AocSolution" RENAME TO "AocSolution";
CREATE INDEX "AocSolution_aocYearId_idx" ON "AocSolution"("aocYearId");
CREATE INDEX "AocSolution_aocPuzzleId_idx" ON "AocSolution"("aocPuzzleId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
