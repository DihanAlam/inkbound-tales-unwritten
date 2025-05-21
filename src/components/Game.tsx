
import React from "react";
import { GameProvider, useGameContext } from "@/context/GameContext";
import StartScreen from "@/components/StartScreen";
import GameEngine from "@/components/GameEngine";
import GameHUD from "@/components/GameHUD";
import PauseScreen from "@/components/PauseScreen";
import GameOverScreen from "@/components/GameOverScreen";

const GameContent: React.FC = () => {
  const { gameState } = useGameContext();

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {gameState === "start" ? (
        <StartScreen />
      ) : (
        <>
          <GameHUD />
          <div className="relative">
            <GameEngine />
            {gameState === "paused" && <PauseScreen />}
            {gameState === "gameover" && <GameOverScreen />}
          </div>
          
          <div className="mt-4 text-sm text-gray-500 max-w-md text-center">
            <p>
              Restore the page by defeating corrupted enemies. Use your slip power (S key) to pass through cracks.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

const Game: React.FC = () => {
  return (
    <GameProvider>
      <div className="page page-fantasy min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <GameContent />
        </div>
      </div>
    </GameProvider>
  );
};

export default Game;
