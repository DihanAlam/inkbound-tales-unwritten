
import React, { useEffect, useRef } from "react";
import { Player, Enemy, Platform } from "@/context/types";
import { updatePlayerPhysics, updateEnemyPositions, checkEnemyCollisions } from "@/utils/gamePhysics";

interface GameLoopProps {
  gameState: "start" | "playing" | "paused" | "gameover";
  canvasSize: { width: number; height: number };
  player: Player;
  platforms: Platform[];
  enemies: Enemy[];
  keysPressed: React.MutableRefObject<{ [key: string]: boolean }>;
  movePlayer: (direction: "left" | "right" | "up" | "none") => void;
  setGameState: (state: "start" | "playing" | "paused" | "gameover") => void;
  restoreArea: (areaId: string) => void;
  renderFrame: (ctx: CanvasRenderingContext2D) => void;
}

const GameLoop: React.FC<GameLoopProps> = ({
  gameState,
  canvasSize,
  player,
  platforms,
  enemies,
  keysPressed,
  movePlayer,
  setGameState,
  restoreArea,
  renderFrame
}) => {
  const lastTime = useRef<number>(0);
  const requestIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update game state
  const update = (timestamp: number) => {
    if (gameState !== "playing") return;
    
    const deltaTime = timestamp - lastTime.current;
    lastTime.current = timestamp;
    
    // Handle horizontal movement based on keys pressed
    // This happens on every frame update
    if (keysPressed.current.ArrowLeft || keysPressed.current.a) {
      movePlayer("left");
    } else if (keysPressed.current.ArrowRight || keysPressed.current.d) {
      movePlayer("right");
    } else {
      movePlayer("none");
    }
    
    // Jumping is handled in useGameInput.ts now, on initial key press
    // This removes the need to check for jump condition here
    
    // Update player position with physics
    const newPlayer = updatePlayerPhysics(player, platforms, canvasSize);
    
    // Update enemy positions
    const newEnemies = updateEnemyPositions(enemies, platforms, player, canvasSize);
    
    // Check for enemy collisions
    const { player: updatedPlayer, gameOver } = checkEnemyCollisions(newPlayer, enemies, restoreArea);
    
    if (gameOver) {
      setGameState("gameover");
      return;
    }
    
    // Check if player fell off the screen
    if (newPlayer.position.y > canvasSize.height) {
      setGameState("gameover");
      return;
    }
    
    // Draw the current game state
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (ctx) {
      // Clear canvas
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      
      // Draw the current frame
      renderFrame(ctx);
    }
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (timestamp: number) => {
      update(timestamp);
      requestIdRef.current = requestAnimationFrame(render);
    };

    if (gameState === "playing") {
      lastTime.current = performance.now();
      requestIdRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
        requestIdRef.current = null;
      }
    };
  }, [gameState, player, platforms, enemies, canvasSize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="border border-gray-300 bg-white"
    />
  );
};

export default GameLoop;
