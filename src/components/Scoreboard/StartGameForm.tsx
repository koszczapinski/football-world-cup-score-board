import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TypographyH3 } from "@/components/ui/Typography";

export type StartGameParams = {
  homeTeam: string;
  awayTeam: string;
};

interface StartGameFormProps {
  onStartGame: (params: StartGameParams) => void;
}

export const StartGameForm = ({ onStartGame }: StartGameFormProps) => {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const handleSubmit = () => {
    onStartGame({ homeTeam, awayTeam });
    setHomeTeam("");
    setAwayTeam("");
  };

  return (
    <div data-testid="start-game" className="">
      <div className="mb-4">
        <TypographyH3>Start Game</TypographyH3>
      </div>
      <div className="grid grid-cols-2 items-center gap-4">
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
          className="text-center"
        />
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
          className="text-center"
        />
        <Button
          aria-label="Start Game"
          onClick={handleSubmit}
          className="col-span-2"
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};
