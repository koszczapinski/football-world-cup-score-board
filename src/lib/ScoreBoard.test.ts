import { beforeEach, describe, expect, it } from "vitest";
import { ScoreBoard } from "./ScoreBoard";

describe("ScoreBoard", () => {
  let scoreboard: ScoreBoard;

  beforeEach(() => {
    scoreboard = new ScoreBoard();
  });

  it("should create a new scoreboard", () => {
    expect(scoreboard).toBeDefined();
  });

  describe("startGame", () => {
    it("should start a new game with initial score 0-0", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      const games = scoreboard.getAllGames();
      expect(game).toEqual({
        id: expect.any(String),
        homeTeam: "Mexico",
        awayTeam: "Canada",
        homeScore: 0,
        awayScore: 0,
      });
      expect(games).toHaveLength(1);
    });

    it("should throw error if teams are empty", () => {
      expect(() =>
        scoreboard.startGame({ homeTeam: "", awayTeam: "Canada" })
      ).toThrow("Both home team and away team are required");
      expect(() =>
        scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "" })
      ).toThrow("Both home team and away team are required");
      expect(() =>
        scoreboard.startGame({ homeTeam: "", awayTeam: "" })
      ).toThrow("Both home team and away team are required");
    });

    it("should prevent duplicate games", () => {
      scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "Canada" });
      expect(() =>
        scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "Canada" })
      ).toThrow("Game already started");
      expect(scoreboard.getAllGames()).toHaveLength(1);
    });
  });
});
