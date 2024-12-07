/*
  Warnings:

  - You are about to drop the column `day` on the `AocSolution` table. All the data in the column will be lost.

*/
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
    "solvedAt" DATETIME NOT NULL,
    "isTestData" BOOLEAN NOT NULL DEFAULT false,
    "isAocData" BOOLEAN NOT NULL DEFAULT false,
    "explanation" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "AocSolution_aocYearId_fkey" FOREIGN KEY ("aocYearId") REFERENCES "AocYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AocSolution_aocPuzzleId_fkey" FOREIGN KEY ("aocPuzzleId") REFERENCES "AocPuzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AocSolution" ("aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt") SELECT "aocPuzzleId", "aocYearId", "createdAt", "explanation", "id", "input", "isAocData", "isSolutionValid", "isTestData", "solutionData", "solvedAt", "updatedAt" FROM "AocSolution";
DROP TABLE "AocSolution";
ALTER TABLE "new_AocSolution" RENAME TO "AocSolution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
