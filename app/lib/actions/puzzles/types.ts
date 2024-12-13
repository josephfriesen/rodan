export type PuzzleType = {
  id: number;
  day: number;
  externalUrl: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  year: {
    id: number;
    year: number;
    externalUrl: string;
    url: string;
  };
  solutions: {
    id: number;
    createdAt: Date;
    explanation: string;
    input: string;
    solutionData: string;
    isSolutionValid: boolean;
    isTestData: boolean;
    isAocData: boolean;
    solvedAt: Date | null;
    url: string;
  }[];
};

export const SELECT_PUZZLES = {
  id: true,
  day: true,
  externalUrl: true,
  url: true,
  createdAt: true,
  updatedAt: true,
  year: {
    select: {
      id: true,
      year: true,
      externalUrl: true,
      url: true,
    },
  },
  solutions: {
    select: {
      id: true,
      createdAt: true,
      explanation: true,
      input: true,
      solutionData: true,
      isSolutionValid: true,
      isTestData: true,
      isAocData: true,
      solvedAt: true,
      url: true,
    },
  },
};

export type NewPuzzleDataType = {
  id: number;
  day: number;
  year: { year: number };
  url: string;
};
