import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";
import { useState } from "react";

const scoreBoard = new ScoreBoardLib();

const ScoreBoard = () => {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const handleStartGame = () => {
    scoreBoard.startGame({ homeTeam, awayTeam });
    setHomeTeam("");
    setAwayTeam("");
  };

  return (
    <div data-testid="scoreboard">
      <h1>Football World Cup Score Board</h1>
      <div data-testid="start-game">
        <label htmlFor="homeTeam" className="sr-only">
          Home Team
        </label>
        <input
          id="homeTeam"
          type="text"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Home Team"
          aria-label="Home Team"
        />
        <label htmlFor="awayTeam" className="sr-only">
          Away Team
        </label>
        <input
          id="awayTeam"
          type="text"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Away Team"
          aria-label="Away Team"
        />
        <button onClick={handleStartGame}>Start Game</button>
      </div>

      <div data-testid="live-games">
        <h2>Live Games</h2>
        <ul>
          {scoreBoard
            .getLiveGames()
            .map(({ id, homeTeam, awayTeam, homeScore, awayScore }) => (
              <li
                key={id}
                aria-label={`${homeTeam} vs ${awayTeam}`}
                className="flex flex-col items-center gap-2"
              >
                <h3 aria-label="Home team" className="text-lg font-bold">
                  {homeTeam}
                </h3>
                <div
                  role="status"
                  aria-label={`Current score: ${awayTeam} ${awayScore}, ${homeTeam} ${homeScore}`}
                  className="flex items-center gap-2"
                >
                  <span>{awayScore}</span>
                  <span aria-hidden="true">:</span>
                  <span>{homeScore}</span>
                </div>
                <h3 aria-label="Away team">{awayTeam}</h3>
              </li>
            ))}
        </ul>
      </div>

      <div data-testid="summary">
        <h2>Summary</h2>
      </div>
    </div>
  );
};

export default ScoreBoard;
