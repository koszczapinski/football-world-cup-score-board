import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("allows user to start a new game with correct initial values", () => {
    const homeTeamInput = screen.getByLabelText("Home Team");
    const awayTeamInput = screen.getByLabelText("Away Team");
    const startGameButton = screen.getByRole("button", {
      name: "Start Game",
    });

    fireEvent.change(homeTeamInput, { target: { value: "Mexico" } });
    fireEvent.change(awayTeamInput, { target: { value: "Canada" } });
    fireEvent.click(startGameButton);

    const liveGamesSection = screen.getByTestId("live-games");
    const gameItem = within(liveGamesSection).getByRole("listitem", {
      name: "Mexico vs Canada",
    });

    const homeTeam = within(gameItem).getByRole("heading", {
      name: "Home team",
      level: 3,
    });
    const awayTeam = within(gameItem).getByRole("heading", {
      name: "Away team",
      level: 3,
    });

    expect(homeTeam).toHaveTextContent("Mexico");
    expect(awayTeam).toHaveTextContent("Canada");

    const scoreDisplay = within(gameItem).getByRole("status");
    expect(scoreDisplay).toHaveAccessibleName(
      "Current score: Canada 0, Mexico 0"
    );
    expect(scoreDisplay).toHaveTextContent("0:0");
  });
});
