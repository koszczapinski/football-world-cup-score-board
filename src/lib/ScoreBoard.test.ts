import { beforeEach, describe, expect, it } from "vitest";
import { ScoreBoard } from "./ScoreBoard";
import { GameStatus } from "./types";

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
        timestamp: expect.any(Number),
        status: GameStatus.LIVE,
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

    it("should throw error if teams are already playing", () => {
      scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "Canada" });
      expect(() =>
        scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "Canada" })
      ).toThrow("Game already started");
      expect(scoreboard.getAllGames()).toHaveLength(1);
    });

    it("should throw error if away team is the same as home team", () => {
      expect(() =>
        scoreboard.startGame({ homeTeam: "Mexico", awayTeam: "Mexico" })
      ).toThrow("Home team and away team cannot be the same");
    });
  });

  describe("finishGame", () => {
    it("should finish a game", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      scoreboard.finishGame(game.id);

      const finishedGames = scoreboard.getFinishedGames();
      const liveGames = scoreboard.getLiveGames();

      expect(finishedGames).toHaveLength(1);
      expect(liveGames).toHaveLength(0);
    });

    it("should not allow finishing already finished game", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      scoreboard.finishGame(game.id);
      expect(() => scoreboard.finishGame(game.id)).toThrow(
        "Game already finished"
      );
    });

    it("should throw error if game is not found", () => {
      expect(() => scoreboard.finishGame("not-existing-id")).toThrow(
        "Game not found"
      );
    });
  });

  describe("updateScore", () => {
    it("should update the score of a game", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      scoreboard.updateScore(game.id, {
        homeScore: 1,
        awayScore: 2,
      });

      expect(game.homeScore).toBe(1);
      expect(game.awayScore).toBe(2);
    });

    it("should not allow negative scores", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      expect(() =>
        scoreboard.updateScore(game.id, {
          homeScore: -1,
          awayScore: 2,
        })
      ).toThrow("Score cannot be negative");
    });

    it("should not allow non-integer scores", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      expect(() =>
        scoreboard.updateScore(game.id, { homeScore: 1.5, awayScore: NaN })
      ).toThrow("Scores must be integer numbers");
    });

    it("should not update score for finished match", () => {
      const game = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      scoreboard.finishGame(game.id);
      expect(() =>
        scoreboard.updateScore(game.id, {
          homeScore: 1,
          awayScore: 2,
        })
      ).toThrow("Game already finished");
    });

    it("should throw error if game is not found", () => {
      expect(() =>
        scoreboard.updateScore("not-existing-id", {
          homeScore: 1,
          awayScore: 2,
        })
      ).toThrow("Game not found");
    });
  });

  describe("getSummaryByTotalScore", () => {
    it("should return a summary of games by total score", async () => {
      const game1 = scoreboard.startGame({
        homeTeam: "Mexico",
        awayTeam: "Canada",
      });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const game2 = scoreboard.startGame({
        homeTeam: "Spain",
        awayTeam: "Brazil",
      });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const game3 = scoreboard.startGame({
        homeTeam: "Germany",
        awayTeam: "France",
      });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const game4 = scoreboard.startGame({
        homeTeam: "Uruguay",
        awayTeam: "Italy",
      });
      await new Promise((resolve) => setTimeout(resolve, 100));

      const game5 = scoreboard.startGame({
        homeTeam: "Argentina",
        awayTeam: "Australia",
      });

      scoreboard.updateScore(game1.id, { homeScore: 0, awayScore: 5 });
      scoreboard.updateScore(game2.id, { homeScore: 10, awayScore: 2 });
      scoreboard.updateScore(game3.id, { homeScore: 2, awayScore: 2 });
      scoreboard.updateScore(game4.id, { homeScore: 6, awayScore: 6 });
      scoreboard.updateScore(game5.id, { homeScore: 3, awayScore: 1 });

      scoreboard.finishGame(game1.id);
      scoreboard.finishGame(game2.id);
      scoreboard.finishGame(game3.id);
      scoreboard.finishGame(game4.id);
      scoreboard.finishGame(game5.id);

      const summary = scoreboard.getSummaryByTotalScore();
      expect(summary).toEqual([game4, game2, game1, game5, game3]);
    });
  });
});
