/*
  Warnings:

  - You are about to drop the `aoc_puzzle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aoc_solution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aoc_year` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "aoc_puzzle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "aoc_solution";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "aoc_year";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "AocYear" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalUrl" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/'
);

-- CreateTable
CREATE TABLE "AocPuzzle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "externalUrl" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/',
    "aocYearId" INTEGER NOT NULL,
    CONSTRAINT "AocPuzzle_aocYearId_fkey" FOREIGN KEY ("aocYearId") REFERENCES "AocYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AocSolution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "aocYearId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input" TEXT NOT NULL,
    "solutionData" TEXT NOT NULL,
    "isSolutionValid" BOOLEAN NOT NULL,
    "solvedAt" DATETIME NOT NULL,
    "isTestData" BOOLEAN NOT NULL,
    "isAocData" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,
    "aocPuzzleId" INTEGER NOT NULL,
    CONSTRAINT "AocSolution_aocYearId_fkey" FOREIGN KEY ("aocYearId") REFERENCES "AocYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AocSolution_aocPuzzleId_fkey" FOREIGN KEY ("aocPuzzleId") REFERENCES "AocPuzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AocYear_year_key" ON "AocYear"("year");
