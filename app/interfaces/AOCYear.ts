import { AOCPuzzle } from "./AOCPuzzle";

export interface AOCYear {
  id: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  externalUrl: string;
  url: string;
  aocPuzzles: AOCPuzzle[];
}
