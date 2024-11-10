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

  getAllGames() {
    return this.games;
  }
}
