import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";
import { Game, LiveScores } from "@/lib/types";
import { useCallback, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBoardTitle } from "@/components/ScoreBoardTitle";
import { Card, CardContent } from "@/components/ui/card";

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
    try {
      scoreBoard.startGame({ homeTeam, awayTeam });
      setHomeTeam("");
      setAwayTeam("");
      refreshGames();
    } catch (error) {
      alert(error);
    }
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
      try {
        const scores = liveScores[id];
        if (!scores) return;

        scoreBoard.updateScore(id, {
          homeScore: scores.homeScore ?? 0,
          awayScore: scores.awayScore ?? 0,
        });
        refreshGames();
      } catch (error) {
        alert(error);
      }
    },
    [scoreBoard, liveScores, refreshGames]
  );

  const handleFinishGame = (id: string) => {
    try {
      scoreBoard.finishGame(id);
      refreshGames();
    } catch (error) {
      alert(error);
    }
  };

  const liveGames = scoreBoard.getLiveGames();
  const summary = scoreBoard.getSummaryByTotalScore();

  return (
    <div data-testid="scoreboard" className="container mx-auto p-4">
      <ScoreBoardTitle />
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="w-full h-12">
          <TabsTrigger value="live" className="w-full text-lg font-bold">
            Live Games
          </TabsTrigger>
          <TabsTrigger value="summary" className="w-full text-lg font-bold">
            Summary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live" data-testid="live-games">
          {liveGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              There are no live games
            </p>
          ) : (
            <ul>
              {liveGames.map(
                ({ id, homeTeam, awayTeam, homeScore, awayScore }) => (
                  <li
                    key={id}
                    aria-label={`${homeTeam} vs ${awayTeam}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <Card className="mb-4 w-full">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          <div className="grid grid-cols-2 gap-8 items-center mb-4 w-full">
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">
                                {homeTeam}
                              </h3>
                              <div className="text-3xl font-bold">
                                {homeScore}
                              </div>
                            </div>
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">
                                {awayTeam}
                              </h3>
                              <div className="text-3xl font-bold">
                                {awayScore}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          role="status"
                          aria-label={`Current score: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`}
                          className="items-center gap-2 hidden"
                        >
                          <span>{homeScore}</span>
                          <span aria-hidden="true">:</span>
                          <span>{awayScore}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <hr />
                    <h3 aria-label="Home team" className="text-lg font-bold">
                      {homeTeam}
                    </h3>
                    <h3 aria-label="Away team">{awayTeam}</h3>
                    <div className="flex gap-2">
                      <label htmlFor={`homeScore-${id}`}>Home Score</label>
                      <Input
                        id={`homeScore-${id}`}
                        type="number"
                        min={0}
                        value={liveScores[id]?.homeScore ?? 0}
                        onChange={(e) =>
                          handleScoreInputChange(
                            id,
                            "homeScore",
                            e.target.value
                          )
                        }
                      />
                      <span aria-hidden="true">:</span>
                      <label htmlFor={`awayScore-${id}`}>Away Score</label>
                      <Input
                        id={`awayScore-${id}`}
                        type="number"
                        min={0}
                        value={liveScores[id]?.awayScore ?? 0}
                        onChange={(e) =>
                          handleScoreInputChange(
                            id,
                            "awayScore",
                            e.target.value
                          )
                        }
                      />
                      <Button onClick={() => handleUpdateScore(id)}>
                        Update Score
                      </Button>
                    </div>
                    <Button onClick={() => handleFinishGame(id)}>Finish</Button>
                  </li>
                )
              )}
            </ul>
          )}
          <div
            data-testid="start-game"
            className="grid grid-cols-3 items-center gap-4"
          >
            <label htmlFor="homeTeam" className="sr-only">
              Home Team
            </label>
            <Input
              id="homeTeam"
              type="text"
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              placeholder="Home Team"
              aria-label="Home Team"
            />
            <Button onClick={handleStartGame}>Start Game</Button>
            <label htmlFor="awayTeam" className="sr-only">
              Away Team
            </label>
            <Input
              id="awayTeam"
              type="text"
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              placeholder="Away Team"
              aria-label="Away Team"
            />
          </div>
        </TabsContent>
        <TabsContent value="summary" data-testid="summary">
          {summary.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              There are no finished games
            </p>
          ) : (
            <ul>
              {summary.map(
                ({ id, homeTeam, awayTeam, homeScore, awayScore }) => (
                  <li
                    key={id}
                    aria-label={`${homeTeam} vs ${awayTeam}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <Card className="mb-4 w-full">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center">
                          <div className="grid grid-cols-2 gap-8 items-center mb-4 w-full">
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">
                                {homeTeam}
                              </h3>
                              <div className="text-3xl font-bold">
                                {homeScore}
                              </div>
                            </div>
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">
                                {awayTeam}
                              </h3>
                              <div className="text-3xl font-bold">
                                {awayScore}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          role="status"
                          aria-label={`Total score: ${homeTeam} ${homeScore}, ${awayTeam} ${awayScore}`}
                          className="items-center gap-2 hidden"
                        >
                          <span>{homeScore}</span>
                          <span aria-hidden="true">:</span>
                          <span>{awayScore}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                )
              )}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScoreBoard;
