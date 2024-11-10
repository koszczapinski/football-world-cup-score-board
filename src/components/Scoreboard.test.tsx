import userEvent from "@testing-library/user-event";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
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

  it("renders summary section", async () => {
    const summarySection = await screen.findByTestId("summary");
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

  it("allows user to finish a game", async () => {
    const homeTeamInput = screen.getByLabelText("Home Team");
    const awayTeamInput = screen.getByLabelText("Away Team");
    const startGameButton = screen.getByRole("button", {
      name: "Start Game",
    });

    fireEvent.change(homeTeamInput, { target: { value: "Poland" } });
    fireEvent.change(awayTeamInput, { target: { value: "Argentina" } });
    fireEvent.click(startGameButton);

    const liveGamesSection = screen.getByTestId("live-games");
    const gameItem = within(liveGamesSection).getByRole("listitem", {
      name: "Poland vs Argentina",
    });

    const finishGameButton = within(gameItem).getByRole("button", {
      name: "Finish",
    });

    fireEvent.click(finishGameButton);

    expect(gameItem).not.toBeInTheDocument();
  });

  it("allows user to update the score of a game", async () => {
    const homeTeamInput = screen.getByLabelText("Home Team");
    const awayTeamInput = screen.getByLabelText("Away Team");
    const startGameButton = screen.getByRole("button", {
      name: "Start Game",
    });

    fireEvent.change(homeTeamInput, { target: { value: "Germany" } });
    fireEvent.change(awayTeamInput, { target: { value: "France" } });
    fireEvent.click(startGameButton);

    const liveGamesSection = screen.getByTestId("live-games");
    const gameItem = within(liveGamesSection).getByRole("listitem", {
      name: "Germany vs France",
    });

    const homeScoreInput = within(gameItem).getByLabelText("Home Score");
    const awayScoreInput = within(gameItem).getByLabelText("Away Score");
    const updateScoreButton = within(gameItem).getByRole("button", {
      name: "Update Score",
    });

    fireEvent.change(homeScoreInput, { target: { value: "1" } });
    fireEvent.change(awayScoreInput, { target: { value: "2" } });
    fireEvent.click(updateScoreButton);

    await waitFor(() => {
      const scoreDisplay = within(gameItem).getByRole("status");
      expect(scoreDisplay).toHaveAccessibleName(
        "Current score: France 2, Germany 1"
      );
      expect(scoreDisplay).toHaveTextContent("2:1");
    });
  });

  it("renders the summary section with the correct games", async () => {
    const user = userEvent.setup();

    // Start game
    const homeTeamInput = screen.getByLabelText("Home Team");
    const awayTeamInput = screen.getByLabelText("Away Team");
    const startGameButton = screen.getByRole("button", { name: "Start Game" });

    await user.type(homeTeamInput, "Germany");
    await user.type(awayTeamInput, "France");
    await user.click(startGameButton);

    // Update score
    const liveGame = await screen.findByRole("listitem", {
      name: "Germany vs France",
    });
    const homeScoreInput = within(liveGame).getByLabelText("Home Score");
    const awayScoreInput = within(liveGame).getByLabelText("Away Score");
    const updateScoreButton = within(liveGame).getByRole("button", {
      name: "Update Score",
    });

    await user.type(homeScoreInput, "2");
    await user.type(awayScoreInput, "3");
    await user.click(updateScoreButton);

    // Finish game
    const finishButton = within(liveGame).getByRole("button", {
      name: "Finish",
    });
    await user.click(finishButton);

    // Switch to summary tab
    await user.click(screen.getByRole("tab", { name: /summary/i }));

    // Wait for and verify the summary content
    const summaryPanel = await screen.findByRole("tabpanel", {
      name: /summary/i,
    });
    const summaryList = within(summaryPanel).getByRole("list");
    const summaryItems = within(summaryList).getAllByRole("listitem");

    expect(summaryItems).toHaveLength(1);
    expect(summaryItems[0]).toHaveAccessibleName("Germany vs France");

    const scoreDisplay = within(summaryItems[0]).getByRole("status");

    screen.debug(scoreDisplay);

    expect(scoreDisplay).toHaveAccessibleName(
      "Total score: France 3, Germany 2"
    );
    expect(scoreDisplay).toHaveTextContent("3:2");
  });
});
