
import React from "react";
import { useGameContext } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

const GameOverScreen: React.FC = () => {
  const { score, restartGame, startGame } = useGameContext();

  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-2">Story Interrupted</h2>
        
        <p className="text-gray-600 mb-4">
          Your ink has been scattered across the pages. The narrative remains unfinished.
        </p>
        
        <div className="bg-gray-100 p-3 rounded-md mb-6">
          <p className="font-medium">Final Score: {score}</p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => {
              console.log("Try Again clicked, calling restartGame");
              restartGame();
            }}
            className="w-full bg-black hover:bg-gray-800 text-white"
          >
            Try Again
          </Button>
          
          <Button 
            onClick={() => {
              console.log("Restart with New Story clicked, calling startGame");
              startGame();
            }}
            variant="outline"
            className="w-full"
          >
            Restart with New Story
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
