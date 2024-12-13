import { AOCYear } from './AOCYear';
import { AOCPuzzle } from './AOCPuzzle';

export interface AOCSolution {
  id: number;
  year: AOCYear;
  puzzle: AOCPuzzle;
  createdAt: string;
  updatedAt: string;
  explanation: string;
  input: string;
  solutionData: { [key: string]: string | number };
  isSolutionValid: boolean;
  isTestData: boolean;
  isAocData: boolean;
  solvedAt: string;
}
