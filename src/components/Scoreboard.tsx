import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";

const scoreBoard = new ScoreBoardLib();

const ScoreBoard = () => {
  return (
    <>
      <div data-testid="scoreboard">
        <h1>Football World Cup Score Board</h1>
      </div>

      <div data-testid="start-game">
        <button>Start Game</button>
      </div>

      <div data-testid="live-games">
        <h2>Live Games</h2>
      </div>

      <div data-testid="summary">
        <h2>Summary</h2>
      </div>
    </>
  );
};

export default ScoreBoard;
