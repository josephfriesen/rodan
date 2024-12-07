-- CreateTable
CREATE TABLE "AOCYear" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "external_url" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/'
);

-- CreateTable
CREATE TABLE "AOCPuzzle" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "day" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "external_url" TEXT NOT NULL DEFAULT 'https://www.adventofcode.com/',
    "url" TEXT NOT NULL DEFAULT '/advent-of-code/',
    "aoc_year_id" INTEGER NOT NULL,
    CONSTRAINT "AOCPuzzle_aoc_year_id_fkey" FOREIGN KEY ("aoc_year_id") REFERENCES "AOCYear" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AOCSolution" (
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
    CONSTRAINT "AOCSolution_aoc_puzzle_id_fkey" FOREIGN KEY ("aoc_puzzle_id") REFERENCES "AOCPuzzle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AOCYear_year_key" ON "AOCYear"("year");
