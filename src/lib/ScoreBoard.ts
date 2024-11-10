type Game = {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
};

export class ScoreBoard {
  private games: Game[] = [];

  startGame({ homeTeam, awayTeam }: { homeTeam: string; awayTeam: string }) {
    const game: Game = {
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
