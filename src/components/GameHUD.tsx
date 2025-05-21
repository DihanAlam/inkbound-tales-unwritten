
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

const GameHUD: React.FC = () => {
  const { score, player, gameState, pauseGame, resumeGame, restartGame } = useGameContext();

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center space-x-1">
        <div className={`w-3 h-3 rounded-full ${player.powers.slip ? "bg-restored-blue" : "bg-gray-300"}`}></div>
        <div className={`w-3 h-3 rounded-full ${player.powers.rewind ? "bg-restored-purple" : "bg-gray-300"}`}></div>
        <div className={`w-3 h-3 rounded-full ${player.powers.blot ? "bg-restored-red" : "bg-gray-300"}`}></div>
        <span className="text-sm ml-2">Powers</span>
      </div>
      
      <div className="text-xl font-bold">Score: {score}</div>
      
      <div>
        {gameState === "playing" && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={pauseGame}
            className="text-sm"
          >
            Pause
          </Button>
        )}
        
        {gameState === "paused" && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={resumeGame}
            className="text-sm bg-black text-white"
          >
            Resume
          </Button>
        )}
        
        {gameState === "gameover" && (
          <Button 
            variant="default" 
            size="sm" 
            onClick={restartGame}
            className="text-sm bg-black text-white"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameHUD;
