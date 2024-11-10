import { Game, GameStatus, StartGameParams, UpdateScoreParams } from "./types";

export class ScoreBoard {
  private games: Game[] = [];

  private generateId(): string {
    return crypto.randomUUID();
  }

  private getCurrentTimestamp(): number {
    return Date.now();
  }

  private getGameById(id: string): Game {
    if (!id) {
      throw new Error("Game ID is required");
    }

    const game = this.games.find((game) => game.id === id);
    if (!game) {
      throw new Error("Game not found");
    }

    return game;
  }

  private validateTeams(homeTeam: string, awayTeam: string): void {
    if (!homeTeam || !awayTeam) {
      throw new Error("Both home team and away team are required");
    }

    if (homeTeam === awayTeam) {
      throw new Error("Home team and away team cannot be the same");
    }
  }

  private validateScores(homeScore: number, awayScore: number): void {
    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Score cannot be negative");
    }
  }

  private calculateTotalScore(game: Game): number {
    return game.homeScore + game.awayScore;
  }

  private sortByTotalScoreAndTimestamp(a: Game, b: Game): number {
    const totalScoreA = this.calculateTotalScore(a);
    const totalScoreB = this.calculateTotalScore(b);

    if (totalScoreB !== totalScoreA) {
      return totalScoreB - totalScoreA;
    }

    return b.timestamp - a.timestamp;
  }

  startGame({ homeTeam, awayTeam }: StartGameParams) {
    this.validateTeams(homeTeam, awayTeam);

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

  updateScore(id: string, { homeScore, awayScore }: UpdateScoreParams) {
    this.validateScores(homeScore, awayScore);

    const game = this.getGameById(id);

    if (game.status === GameStatus.FINISHED) {
      throw new Error("Game already finished");
    }

    game.homeScore = homeScore;
    game.awayScore = awayScore;
  }

  finishGame(id: string) {
    const game = this.getGameById(id);

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

  getSummaryByTotalScore(): Game[] {
    return this.games
      .filter((game) => game.status === GameStatus.FINISHED)
      .sort((a, b) => this.sortByTotalScoreAndTimestamp(a, b));
  }
}
