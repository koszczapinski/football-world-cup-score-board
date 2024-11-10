type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

export class ScoreBoard {
  private games: Game[] = [];

  startGame({ homeTeam, awayTeam }: { homeTeam: string; awayTeam: string }) {
    if (!homeTeam || !awayTeam) {
      throw new Error("Both home team and away team are required");
    }

    if (homeTeam === awayTeam) {
      throw new Error("Home team and away team cannot be the same");
    }

    if (
      this.games.some(
        (game) => game.homeTeam === homeTeam || game.awayTeam === awayTeam
      )
    ) {
      throw new Error("Game already started");
    }

    const game: Game = {
      id: crypto.randomUUID(),
      homeTeam,
      awayTeam,
      homeScore: 0,
      awayScore: 0,
    };
    this.games.push(game);
    return game;
  }

  getAllGames() {
    return this.games;
  }
}
