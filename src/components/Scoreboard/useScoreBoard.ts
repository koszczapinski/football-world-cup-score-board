import { useCallback, useState, useMemo } from "react";
import { ScoreBoard as ScoreBoardLib } from "@/lib/ScoreBoard";
import { Game, LiveScores } from "@/lib/types";
import { StartGameParams } from "@/components/ScoreBoard/StartGameForm";

export const useScoreBoard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [liveScores, setLiveScores] = useState<LiveScores>({});
  const scoreBoard = useMemo(() => new ScoreBoardLib(), []);

  const refreshGames = useCallback(() => {
    setGames([...scoreBoard.getAllGames()]);
    console.log(games);
  }, [scoreBoard, games]);

  const handleStartGame = useCallback(
    ({ homeTeam, awayTeam }: StartGameParams) => {
      try {
        scoreBoard.startGame({ homeTeam, awayTeam });
        refreshGames();
      } catch (error) {
        alert(error);
      }
    },
    [scoreBoard, refreshGames]
  );

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

  const handleFinishGame = useCallback(
    (id: string) => {
      try {
        scoreBoard.finishGame(id);
        refreshGames();
      } catch (error) {
        alert(error);
      }
    },
    [scoreBoard, refreshGames]
  );

  return {
    liveGames: scoreBoard.getLiveGames(),
    summary: scoreBoard.getSummaryByTotalScore(),
    liveScores,
    handleStartGame,
    handleScoreInputChange,
    handleUpdateScore,
    handleFinishGame,
  };
};
