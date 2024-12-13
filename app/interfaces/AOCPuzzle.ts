import { AOCYear } from './AOCYear';
import { AOCSolution } from './AOCSolution';

export interface AOCPuzzle {
  id: number;
  day: number;
  createdAt: string;
  updatedAt: string;
  externalUrl: string;
  url: string;
  aocYear: AOCYear;
  solutions: Array<AOCSolution>;
}
