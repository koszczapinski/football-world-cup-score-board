import { describe, expect, it } from "vitest";
import { ScoreBoard } from "./ScoreBoard";

describe("ScoreBoard", () => {
  it("should create a new scoreboard", () => {
    const scoreboard = new ScoreBoard();
    expect(scoreboard).toBeDefined();
  });
});
