import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScoreBoardTitle } from "@/components/ScoreBoard/ScoreBoardTitle";
import { StartGameForm } from "@/components/ScoreBoard/StartGameForm";
import { LiveGameCard } from "@/components/ScoreBoard/LiveGameCard";
import { SummaryGameCard } from "@/components/ScoreBoard/SummaryGameCard";
import { useScoreBoard } from "@/components/ScoreBoard/useScoreBoard";

const ScoreBoard = () => {
  const {
    liveGames,
    summary,
    liveScores,
    handleStartGame,
    handleScoreInputChange,
    handleUpdateScore,
    handleFinishGame,
  } = useScoreBoard();

  return (
    <div data-testid="scoreboard" className="container mx-auto p-4">
      <ScoreBoardTitle />
      <Tabs defaultValue="live" className="w-full">
        <TabsList className="w-full h-12">
          <TabsTrigger value="live" className="w-full text-lg font-bold">
            Live Games ({liveGames.length})
          </TabsTrigger>
          <TabsTrigger value="summary" className="w-full text-lg font-bold">
            Summary ({summary.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" data-testid="live-games">
          {liveGames.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              There are no live games
            </p>
          ) : (
            <ul>
              {liveGames.map((game) => (
                <li
                  key={game.id}
                  aria-label={`${game.homeTeam} vs ${game.awayTeam}`}
                  className="flex flex-col items-center gap-2"
                >
                  <LiveGameCard
                    game={game}
                    liveScores={liveScores}
                    onScoreChange={handleScoreInputChange}
                    onUpdateScore={handleUpdateScore}
                    onFinishGame={handleFinishGame}
                  />
                </li>
              ))}
            </ul>
          )}
          <StartGameForm onStartGame={handleStartGame} />
        </TabsContent>

        <TabsContent value="summary" data-testid="summary">
          {summary.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              There are no finished games
            </p>
          ) : (
            <ul>
              {summary.map((game) => (
                <li
                  key={game.id}
                  aria-label={`${game.homeTeam} vs ${game.awayTeam}`}
                  className="flex flex-col items-center gap-2"
                >
                  <SummaryGameCard game={game} />
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScoreBoard;
