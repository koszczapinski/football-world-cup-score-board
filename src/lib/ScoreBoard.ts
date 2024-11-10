import { Game, GameStatus, StartGameParams, UpdateScoreParams } from "./types";

/** Represents a football scoreboard that manages live and finished games */
export class ScoreBoard {
  /** Internal storage for games */
  private games: Game[] = [];

  /**
   * Generates a unique identifier for a game
   * @returns {string} A unique UUID
   * @private
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Gets the current timestamp in milliseconds
   * @returns {number} Current timestamp
   * @private
   */
  private getCurrentTimestamp(): number {
    return Date.now();
  }

  /**
   * Creates a new game instance with initial scores set to 0
   * @param {string} homeTeam - Name of the home team
   * @param {string} awayTeam - Name of the away team
   * @returns {Game} New game instance
   * @private
   */
  private createGame(homeTeam: string, awayTeam: string): Game {
    return {
      id: this.generateId(),
      homeTeam: this.normalizeTeamName(homeTeam),
      awayTeam: this.normalizeTeamName(awayTeam),
      homeScore: 0,
      awayScore: 0,
      timestamp: this.getCurrentTimestamp(),
      status: GameStatus.LIVE,
    };
  }

  /**
   * Normalizes team names to have consistent capitalization and spacing
   * @param {string} name - Raw team name input
   * @returns {string} Normalized team name
   * @throws {Error} If team name is empty
   * @private
   */
  private normalizeTeamName(name: string): string {
    if (!name) {
      throw new Error("Team name cannot be empty");
    }

    return name
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  /**
   * Retrieves a game by its ID
   * @param {string} id - Game identifier
   * @returns {Game} Game instance
   * @throws {Error} If game ID is invalid or game not found
   * @private
   */
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

  /**
   * Validates team names for a new game
   * @param {string} homeTeam - Home team name
   * @param {string} awayTeam - Away team name
   * @throws {Error} If team names are invalid or identical
   * @private
   */
  private validateTeams(homeTeam: string, awayTeam: string): void {
    if (!homeTeam || !awayTeam) {
      throw new Error("Both home team and away team are required");
    }

    if (homeTeam === awayTeam) {
      throw new Error("Home team and away team cannot be the same");
    }
  }

  /**
   * Validates game scores
   * @param {number} homeScore - Home team score
   * @param {number} awayScore - Away team score
   * @throws {Error} If scores are invalid
   * @private
   */
  private validateScores(homeScore: number, awayScore: number): void {
    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      throw new Error("Scores must be integer numbers");
    }

    if (homeScore < 0 || awayScore < 0) {
      throw new Error("Score cannot be negative");
    }
  }

  /**
   * Calculates the total score for a game
   * @param {Game} game - Game instance
   * @returns {number} Total score
   * @private
   */
  private calculateTotalScore(game: Game): number {
    return game.homeScore + game.awayScore;
  }

  /**
   * Comparison function for sorting games by total score and timestamp
   * @param {Game} a - First game to compare
   * @param {Game} b - Second game to compare
   * @returns {number} Comparison result
   * @private
   */
  private sortByTotalScoreAndTimestamp(a: Game, b: Game): number {
    const totalScoreA = this.calculateTotalScore(a);
    const totalScoreB = this.calculateTotalScore(b);

    if (totalScoreB !== totalScoreA) {
      return totalScoreB - totalScoreA;
    }

    return b.timestamp - a.timestamp;
  }

  /**
   * Starts a new game with the given teams
   * @param {StartGameParams} params - Game parameters containing home and away team names
   * @returns {Game} Newly created game
   * @throws {Error} If teams are invalid or game already exists
   */
  startGame({ homeTeam, awayTeam }: StartGameParams): Game {
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

    const game: Game = this.createGame(homeTeam, awayTeam);
    this.games.push(game);
    return game;
  }

  /**
   * Updates the score for a specific game
   * @param {string} id - Game identifier
   * @param {UpdateScoreParams} params - New scores for the game
   * @throws {Error} If game is not found, already finished, or scores are invalid
   */
  updateScore(id: string, { homeScore, awayScore }: UpdateScoreParams): void {
    this.validateScores(homeScore, awayScore);

    const game = this.getGameById(id);

    if (game.status === GameStatus.FINISHED) {
      throw new Error("Game already finished");
    }

    game.homeScore = homeScore;
    game.awayScore = awayScore;
  }

  /**
   * Marks a game as finished
   * @param {string} id - Game identifier
   * @throws {Error} If game is not found or already finished
   */
  finishGame(id: string): void {
    const game = this.getGameById(id);

    if (game.status === GameStatus.FINISHED) {
      throw new Error("Game already finished");
    }

    game.status = GameStatus.FINISHED;
  }

  /**
   * Retrieves all games in the system
   * @returns {Game[]} Array of all games
   */
  getAllGames(): Game[] {
    return this.games;
  }

  /**
   * Retrieves all live games
   * @returns {Game[]} Array of live games
   */
  getLiveGames(): Game[] {
    return this.games.filter((game) => game.status === GameStatus.LIVE);
  }

  /**
   * Retrieves all finished games
   * @returns {Game[]} Array of finished games
   */
  getFinishedGames(): Game[] {
    return this.games.filter((game) => game.status === GameStatus.FINISHED);
  }

  /**
   * Gets a summary of finished games sorted by total score (descending)
   * and then by most recently added
   * @returns {Game[]} Sorted array of finished games
   */
  getSummaryByTotalScore(): Game[] {
    return this.getFinishedGames().sort((a, b) =>
      this.sortByTotalScoreAndTimestamp(a, b)
    );
  }
}
