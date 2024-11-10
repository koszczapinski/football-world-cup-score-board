import { describe, expect, it } from "vitest";
import { ScoreBoard } from "./ScoreBoard";

describe("ScoreBoard", () => {
  it("should create a new scoreboard", () => {
    const scoreboard = new ScoreBoard();
    expect(scoreboard).toBeDefined();
  });

  describe("startGame", () => {
    it("should start a new game with initial score 0-0", () => {
      const scoreboard = new ScoreBoard();
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      const games = scoreboard.getAllGames();

      expect(game).toEqual({
        homeTeam: "Mexico",
        awayTeam: "Canada",
        homeScore: 0,
        awayScore: 0,
      });
      expect(games).toHaveLength(1);
    });
  });
});
