import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScoreBoard from "./Scoreboard";

describe("ScoreBoard", () => {
  it("renders app title correctly", () => {
    render(<ScoreBoard />);
    const title = screen.getByRole("heading", {
      name: "Football World Cup Score Board",
    });
    expect(title).toBeInTheDocument();
  });

  // TODO: Add test for the scoreboard
});
