
import { useEffect, useRef } from "react";
import { GameState } from "@/context/types";
import { useGameContext } from "@/context/GameContext";

export const useGameInput = (gameState: GameState) => {
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { movePlayer, useInkPower, pauseGame, resumeGame } = useGameContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      
      // Special key handlers
      if (e.key === "s" || e.key === "S") {
        useInkPower("slip");
      }
      
      if (e.key === "r" || e.key === "R") {
        useInkPower("rewind");
      }
      
      if (e.key === "b" || e.key === "B") {
        useInkPower("blot");
      }
      
      if (e.key === "Escape") {
        if (gameState === "playing") {
          pauseGame();
        } else if (gameState === "paused") {
          resumeGame();
        }
      }
      
      // Prevent scrolling with arrow keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState, useInkPower, pauseGame, resumeGame]);

  return { keysPressed };
};
