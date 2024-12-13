export type SolutionType = {
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
  puzzle: {
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
  };
};

// for selecting the proper fields from a prisma record
// ensure this and SolutionType are in sync with each other
export const SELECT_SOLUTIONS = {
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
  puzzle: {
    select: {
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
    },
  },
};

// stubbed solution data, just for acknowledgement of solution creation success.
// on success, should redirect to solution url.
export type NewSolutionDataType = {
  id: number;
  url: string;
  puzzle: { day: number; year: { year: number } };
};

export type UpdateSolutionPayloadType = {
  input?: string;
  explanation?: string;
  url?: string;
  solutionData?: { [key: string]: string | number };
  isSolutionValid?: boolean;
  solvedAt?: Date | null;
  isTestData?: boolean;
  isAocData?: boolean;
};
