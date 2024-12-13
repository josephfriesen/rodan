export const SELECT_YEARS = {
  id: true,
  year: true,
  externalUrl: true,
  url: true,
  createdAt: true,
  updatedAt: true,
  puzzles: {
    select: {
      id: true,
      day: true,
      externalUrl: true,
      url: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

export type YearType = {
  id: number;
  year: number;
  externalUrl: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  puzzles: {
    id: number;
    day: number;
    externalUrl: string;
    url: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};
