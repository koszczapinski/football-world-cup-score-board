import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";
import { Game, LiveScores } from "@/lib/types";
import { useCallback, useState, useMemo } from "react";

const ScoreBoard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [liveScores, setLiveScores] = useState<LiveScores>({});
  const scoreBoard = useMemo(() => new ScoreBoardLib(), []);

  const refreshGames = useCallback(() => {
    setGames([...scoreBoard.getAllGames()]);
    console.log(games);
  }, [scoreBoard, games]);

  const handleStartGame = () => {
    scoreBoard.startGame({ homeTeam, awayTeam });
    setHomeTeam("");
    setAwayTeam("");
    refreshGames();
  };

  const handleScoreInputChange = useCallback(
    (id: string, field: "homeScore" | "awayScore", value: string) => {
      setLiveScores((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: parseInt(value) || 0,
        },
      }));
    },
    []
  );

  const handleUpdateScore = useCallback(
    (id: string) => {
      const scores = liveScores[id];
      if (!scores) return;

      scoreBoard.updateScore(id, {
        homeScore: scores.homeScore ?? 0,
        awayScore: scores.awayScore ?? 0,
      });
      refreshGames();
    },
    [scoreBoard, liveScores, refreshGames]
  );

  const handleFinishGame = (id: string) => {
    scoreBoard.finishGame(id);
    refreshGames();
  };

  const liveGames = scoreBoard.getLiveGames();
  const summary = scoreBoard.getSummaryByTotalScore();

  return (
    <div data-testid="scoreboard">
      <h1>Football World Cup Score Board</h1>
      <section data-testid="start-game">
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
      </section>

      <section data-testid="live-games">
        <h2>Live Games</h2>
        {liveGames.length > 0 ? (
          <ul>
            {liveGames.map(
              ({ id, homeTeam, awayTeam, homeScore, awayScore }) => (
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
                  <div className="flex gap-2">
                    <label htmlFor={`homeScore-${id}`}>Home Score</label>
                    <input
                      id={`homeScore-${id}`}
                      type="number"
                      min={0}
                      value={liveScores[id]?.homeScore ?? 0}
                      onChange={(e) =>
                        handleScoreInputChange(id, "homeScore", e.target.value)
                      }
                    />
                    <span aria-hidden="true">:</span>
                    <label htmlFor={`awayScore-${id}`}>Away Score</label>
                    <input
                      id={`awayScore-${id}`}
                      type="number"
                      min={0}
                      value={liveScores[id]?.awayScore ?? 0}
                      onChange={(e) =>
                        handleScoreInputChange(id, "awayScore", e.target.value)
                      }
                    />
                    <button onClick={() => handleUpdateScore(id)}>
                      Update Score
                    </button>
                  </div>
                  <button onClick={() => handleFinishGame(id)}>Finish</button>
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            There are no live games currently
          </p>
        )}
      </section>

      <section data-testid="summary">
        <h2>Summary</h2>
        {summary.length > 0 ? (
          <ul>
            {summary.map(({ id, homeTeam, awayTeam, homeScore, awayScore }) => (
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
                  aria-label={`Total score: ${awayTeam} ${awayScore}, ${homeTeam} ${homeScore}`}
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
        ) : (
          <p className="text-gray-500 text-center py-4">
            There are no finished games
          </p>
        )}
      </section>
    </div>
  );
};

export default ScoreBoard;
