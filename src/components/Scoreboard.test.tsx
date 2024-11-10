import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import ScoreBoard from "./ScoreBoard";

describe("ScoreBoard", () => {
  beforeEach(() => {
    render(<ScoreBoard />);
  });

  it("renders the scoreboard component", () => {
    const scoreboard = screen.getByTestId("scoreboard");
    expect(scoreboard).toBeInTheDocument();
  });

  it("renders app title correctly", () => {
    const title = screen.getByRole("heading", {
      name: "Football World Cup Score Board",
    });
    expect(title).toBeInTheDocument();
  });

  it("renders the live games section", () => {
    const liveGamesSection = screen.getByTestId("live-games");
    expect(liveGamesSection).toBeInTheDocument();
  });

  it("renders summary section", () => {
    const summarySection = screen.getByTestId("summary");
    expect(summarySection).toBeInTheDocument();
  });
});
