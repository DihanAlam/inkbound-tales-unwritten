
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

const PauseScreen: React.FC = () => {
  const { resumeGame, startGame } = useGameContext();

  const handleResume = () => {
    console.log("Resume Game clicked, calling resumeGame directly");
    resumeGame();
  };

  const handleRestart = () => {
    console.log("Restart Game clicked, calling startGame directly");
    // Force a state reset before starting a new game
    startGame();
  };

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Game Paused</h2>
        
        <p className="text-gray-600 mb-6">
          Take a moment to gather your thoughts before continuing your journey through the story.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleResume}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Resume Game
          </Button>
          
          <Button 
            onClick={handleRestart}
            variant="outline"
            className="w-full"
          >
            Restart Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PauseScreen;
