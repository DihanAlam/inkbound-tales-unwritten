
import React, { createContext, useContext, useState, useEffect } from "react";
import { GameState, PageType, Player, Enemy, Platform, GameContextType } from "./types";
import { defaultPlayer, initialPlatforms, initialEnemies } from "./initialState";
import { useGameActions } from "./gameActions";

// Export types properly with 'export type' syntax
export type { Position, Player, Enemy, Platform } from "./types";
export type { GameState, PageType } from "./types";

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentPage, setCurrentPage] = useState<PageType>("fantasy");
  const [player, setPlayer] = useState<Player>({ ...defaultPlayer });
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [restoredAreas, setRestoredAreas] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeState, setTimeState] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });
  const [gameLoop, setGameLoop] = useState<number | null>(null);
  
  const actions = useGameActions();

  const startGame = () => {
    console.log("startGame function called");
    actions.startGame(
      setGameState,
      setPlayer,
      setPlatforms,
      setEnemies,
      setRestoredAreas,
      setScore,
      setTimeState,
      defaultPlayer,
      initialPlatforms,
      initialEnemies
    );
  };

  const pauseGame = () => {
    console.log("pauseGame function called");
    actions.pauseGame(gameState, setGameState, gameLoop, setGameLoop);
  };

  const resumeGame = () => {
    console.log("resumeGame function called");
    actions.resumeGame(gameState, setGameState);
  };

  const restartGame = () => {
    console.log("restartGame function called in GameContext");
    // Directly call startGame to restart from any state
    startGame();
  };

  const movePlayer = (direction: "left" | "right" | "up" | "none") => {
    actions.movePlayer(direction, gameState, setPlayer);
  };

  const useInkPower = (power: "slip" | "rewind" | "blot") => {
    actions.useInkPower(power, gameState, player, setPlayer);
  };

  const restoreArea = (areaId: string) => {
    actions.restoreArea(areaId, restoredAreas, setRestoredAreas, setScore, setEnemies);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 900);
      const height = Math.min(window.innerHeight - 200, 600);
      setCanvasSize({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const gameContextValue: GameContextType = {
    gameState,
    currentPage,
    player,
    enemies,
    platforms,
    restoredAreas,
    score,
    timeState,
    canvasSize,
    setGameState,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    movePlayer,
    useInkPower,
    restoreArea,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
