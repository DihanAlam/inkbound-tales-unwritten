
import { useEffect, useRef } from "react";
import { GameState } from "@/context/types";
import { useGameContext } from "@/context/GameContext";

export const useGameInput = (gameState: GameState) => {
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { movePlayer, useInkPower, pauseGame, resumeGame } = useGameContext();
  
  // Track last jump time to prevent jump spamming
  const lastJumpTime = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only register the key as pressed if it wasn't already pressed
      if (!keysPressed.current[e.key]) {
        keysPressed.current[e.key] = true;
        
        // Jump handling when key is first pressed, not continuously
        if ((e.key === "ArrowUp" || e.key === "w" || e.key === " ") && gameState === "playing") {
          const now = Date.now();
          // Prevent jump spamming by requiring a small delay between jumps
          if (now - lastJumpTime.current > 300) {
            movePlayer("up");
            lastJumpTime.current = now;
          }
        }
      }
      
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
  }, [gameState, useInkPower, pauseGame, resumeGame, movePlayer]);

  return { keysPressed };
};
