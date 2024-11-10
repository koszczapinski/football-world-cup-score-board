import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";
import { useState } from "react";

const scoreBoard = new ScoreBoardLib();

export const ScoreBoard = () => {
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
        <input
          type="text"
          value={homeTeam}
          onChange={(e) => setHomeTeam(e.target.value)}
          placeholder="Home Team"
        />
        <input
          type="text"
          value={awayTeam}
          onChange={(e) => setAwayTeam(e.target.value)}
          placeholder="Away Team"
        />
        <button onClick={handleStartGame}>Start Game</button>
      </div>

      <div data-testid="live-games">
        <h2>Live Games</h2>
        {scoreBoard.getAllGames().map((game) => (
          <div key={game.id}>
            <h3>{game.homeTeam}</h3>
            <h3>{game.awayTeam}</h3>
          </div>
        ))}
      </div>

      <div data-testid="summary">
        <h2>Summary</h2>
      </div>
    </div>
  );
};
