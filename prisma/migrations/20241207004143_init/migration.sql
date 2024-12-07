/*
  Warnings:

  - You are about to drop the `AOCPuzzle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AOCSolution` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AOCYear` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AOCPuzzle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AOCSolution";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "AOCYear";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "aoc_year" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "external_url" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/'
);

-- CreateTable
CREATE TABLE "aoc_puzzle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "external_url" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/',
    "aoc_year_id" INTEGER NOT NULL,
    CONSTRAINT "aoc_puzzle_aoc_year_id_fkey" FOREIGN KEY ("aoc_year_id") REFERENCES "aoc_year" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aoc_solution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "input" TEXT NOT NULL,
    "solution_data" TEXT NOT NULL,
    "is_solution_valid" BOOLEAN NOT NULL,
    "solved_at" DATETIME NOT NULL,
    "is_test_data" BOOLEAN NOT NULL,
    "is_aoc_data" BOOLEAN NOT NULL,
    "explanation" TEXT NOT NULL,
    "aoc_puzzle_id" INTEGER NOT NULL,
    CONSTRAINT "aoc_solution_aoc_puzzle_id_fkey" FOREIGN KEY ("aoc_puzzle_id") REFERENCES "aoc_puzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "aoc_year_year_key" ON "aoc_year"("year");
