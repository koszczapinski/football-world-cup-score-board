export enum GameStatus {
  LIVE = "live",
  FINISHED = "finished",
}

export type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  timestamp: number;
  status: GameStatus;
};

export type StartGameParams = {
  homeTeam: string;
  awayTeam: string;
};

export type UpdateScoreParams = {
  homeScore: number;
  awayScore: number;
};

export type LiveScores = {
  [id: string]: {
    homeScore: number;
    awayScore: number;
  };
};
