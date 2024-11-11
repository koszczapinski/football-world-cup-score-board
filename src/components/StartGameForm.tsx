import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface StartGameFormProps {
  onStartGame: ({
    homeTeam,
    awayTeam,
  }: {
    homeTeam: string;
    awayTeam: string;
  }) => void;
}

const StartGameForm = ({ onStartGame }: StartGameFormProps) => {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const handleSubmit = () => {
    onStartGame({ homeTeam, awayTeam });
    setHomeTeam("");
    setAwayTeam("");
  };

  return (
    <div
      data-testid="start-game"
      className="grid grid-cols-2 items-center gap-4"
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
      <Button onClick={handleSubmit} className="col-span-2">
        Start Game
      </Button>
    </div>
  );
};

export default StartGameForm;
