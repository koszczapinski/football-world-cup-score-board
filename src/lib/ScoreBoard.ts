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

export class ScoreBoard {
  private games: Game[] = [];

  private generateId(): string {
    return crypto.randomUUID();
  }

  private getCurrentTimestamp(): number {
    return Date.now();
  }

  startGame({ homeTeam, awayTeam }: { homeTeam: string; awayTeam: string }) {
    if (!homeTeam || !awayTeam) {
      throw new Error("Both home team and away team are required");
    }

    if (homeTeam === awayTeam) {
      throw new Error("Home team and away team cannot be the same");
    }

    const matchExists = this.games.some(
      (game) =>
        game.status === GameStatus.LIVE &&
        game.homeTeam === homeTeam &&
        game.awayTeam === awayTeam
    );

    if (matchExists) {
      throw new Error("Game already started");
    }

    const game: Game = {
      id: this.generateId(),
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
      timestamp: this.getCurrentTimestamp(),
      status: GameStatus.LIVE,
    };

    this.games.push(game);
    return game;
  }

  updateScore(
    id: string,
    { homeScore, awayScore }: { homeScore: number; awayScore: number }
  ) {
    const game = this.games.find((game) => game.id === id);

    if (!game) {
      throw new Error("Game not found");
    }

    if (game.status === GameStatus.FINISHED) {
      throw new Error("Game already finished");
    }

    game.homeScore = homeScore;
    game.awayScore = awayScore;
  }

  finishGame(id: string) {
    const game = this.games.find((game) => game.id === id);
    if (!game) {
      throw new Error("Game not found");
    }

    if (game.status === GameStatus.FINISHED) {
      throw new Error("Game already finished");
    }

    game.status = GameStatus.FINISHED;
  }

  getAllGames(): Game[] {
    return this.games;
  }

  getLiveGames(): Game[] {
    return this.games.filter((game) => game.status === GameStatus.LIVE);
  }

  getFinishedGames(): Game[] {
    return this.games.filter((game) => game.status === GameStatus.FINISHED);
  }
}
