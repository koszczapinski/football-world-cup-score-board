import { Game, LiveScores } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface LiveGameCardProps {
  game: Game;
  liveScores: LiveScores;
  onScoreChange: (
    id: string,
    field: "homeScore" | "awayScore",
    value: string
  ) => void;
  onUpdateScore: (id: string) => void;
  onFinishGame: (id: string) => void;
}

export const LiveGameCard = ({
  game,
  liveScores,
  onScoreChange,
  onUpdateScore,
  onFinishGame,
}: LiveGameCardProps) => {
  const { id, homeTeam, awayTeam, homeScore, awayScore } = game;

  return (
    <Card className="mb-4 w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-8 items-center mb-4 w-full">
            <TeamScore
              team={homeTeam}
              score={homeScore}
              inputId={`homeScore-${id}`}
              inputValue={liveScores[id]?.homeScore ?? 0}
              onChange={(value) => onScoreChange(id, "homeScore", value)}
            />
            <TeamScore
              team={awayTeam}
              score={awayScore}
              inputId={`awayScore-${id}`}
              inputValue={liveScores[id]?.awayScore ?? 0}
              onChange={(value) => onScoreChange(id, "awayScore", value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button
              onClick={() => onUpdateScore(id)}
              aria-label={`Update score for ${homeTeam} vs ${awayTeam}`}
            >
              Update Score
            </Button>
            <Button
              onClick={() => onFinishGame(id)}
              aria-label={`Finish game ${homeTeam} vs ${awayTeam}`}
            >
              Finish
            </Button>
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
        </div>
      </CardContent>
    </Card>
  );
};

interface TeamScoreProps {
  team: string;
  score: number;
  inputId: string;
  inputValue: number;
  onChange: (value: string) => void;
}

const TeamScore = ({
  team,
  score,
  inputId,
  inputValue,
  onChange,
}: TeamScoreProps) => (
  <div className="text-center">
    <h3 className="text-xl font-semibold">{team}</h3>
    <div className="text-3xl font-bold">{score}</div>
    <div className="flex gap-1 flex-col">
      <label htmlFor={inputId} className="text-sm">
        Score
      </label>
      <Input
        id={inputId}
        type="number"
        min={0}
        value={inputValue}
        className="pl-6 text-center"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);
