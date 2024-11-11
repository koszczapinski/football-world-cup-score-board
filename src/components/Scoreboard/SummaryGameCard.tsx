import { Game } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface SummaryGameCardProps {
  game: Game;
}

export const SummaryGameCard = ({ game }: SummaryGameCardProps) => {
  const { homeTeam, awayTeam, homeScore, awayScore } = game;

  return (
    <Card className="mb-4 w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-2 gap-8 items-center mb-4 w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold">{homeTeam}</h3>
              <div className="text-3xl font-bold">{homeScore}</div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{awayTeam}</h3>
              <div className="text-3xl font-bold">{awayScore}</div>
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
  );
};
