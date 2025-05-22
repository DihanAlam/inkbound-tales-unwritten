
import React, { useRef } from "react";
import { useGameContext } from "@/context/GameContext";
import { useGameInput } from "@/hooks/useGameInput";
import GameLoop from "@/components/game/GameLoop";
import PlatformRenderer from "@/components/game/PlatformRenderer";
import EnemyRenderer from "@/components/game/EnemyRenderer";
import PlayerRenderer from "@/components/game/PlayerRenderer";

const GameEngine: React.FC = () => {
  const {
    gameState,
    player,
    enemies,
    platforms,
    canvasSize,
    movePlayer,
    restoreArea,
    setGameState,
  } = useGameContext();
  
  const { keysPressed } = useGameInput(gameState);

  // Function to render a single frame
  const renderFrame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas first (this happens in GameLoop)
    
    // Render all game elements
    // We're not actually using the React components here since we need to render directly to the canvas
    // These are just function calls with the same logic as in the component effects
    
    // Draw platforms
    platforms.forEach((platform) => {
      ctx.fillStyle = platform.type === "solid" ? "black" : "#e0e0e0";
      ctx.fillRect(
        platform.position.x,
        platform.position.y,
        platform.width,
        platform.height
      );
      
      if (platform.type === "crack") {
        // Draw crack pattern
        ctx.strokeStyle = "#cccccc";
        ctx.lineWidth = 1;
        for (let i = 0; i < platform.width; i += 5) {
          for (let j = 0; j < platform.height; j += 5) {
            if (Math.random() > 0.7) {
              ctx.beginPath();
              ctx.moveTo(platform.position.x + i, platform.position.y + j);
              ctx.lineTo(
                platform.position.x + i + 3,
                platform.position.y + j + 3
              );
              ctx.stroke();
            }
          }
        }
      }
    });
    
    // Draw enemies
    enemies.forEach((enemy) => {
      if (!enemy.defeated) {
        ctx.fillStyle = enemy.corrupted ? "#000000" : "#1E3A8A";
        
        if (enemy.corrupted) {
          // Draw corrupted enemy with jagged edges
          ctx.beginPath();
          const x = enemy.position.x;
          const y = enemy.position.y;
          const size = enemy.size;
          
          for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distortion = Math.random() * 5 + 5;
            const radius = size + (i % 2 === 0 ? distortion : -distortion);
            const pointX = x + Math.cos(angle) * radius;
            const pointY = y + Math.sin(angle) * radius;
            
            if (i === 0) {
              ctx.moveTo(pointX, pointY);
            } else {
              ctx.lineTo(pointX, pointY);
            }
          }
          
          ctx.closePath();
          ctx.fill();
          
          // Add some scribbles
          ctx.strokeStyle = "#333333";
          ctx.lineWidth = 1;
          for (let i = 0; i < 5; i++) {
            const startX = x - size / 2 + Math.random() * size;
            const startY = y - size / 2 + Math.random() * size;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(
              startX + Math.random() * 20 - 10,
              startY + Math.random() * 20 - 10,
              startX + Math.random() * 20 - 10,
              startY + Math.random() * 20 - 10,
              startX + Math.random() * 20 - 10,
              startY + Math.random() * 20 - 10
            );
            ctx.stroke();
          }
        } else {
          // Restored enemy
          ctx.beginPath();
          ctx.arc(enemy.position.x, enemy.position.y, enemy.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add a glow effect
          const gradient = ctx.createRadialGradient(
            enemy.position.x,
            enemy.position.y,
            enemy.size * 0.5,
            enemy.position.x,
            enemy.position.y,
            enemy.size * 1.5
          );
          gradient.addColorStop(0, "rgba(30, 58, 138, 0.1)");
          gradient.addColorStop(1, "rgba(30, 58, 138, 0)");
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(
            enemy.position.x,
            enemy.position.y,
            enemy.size * 1.5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    });
    
    // Draw player
    ctx.fillStyle = "black";
    
    // Draw inkblot body
    ctx.beginPath();
    ctx.ellipse(
      player.position.x,
      player.position.y,
      20,
      25,
      Math.PI / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add some ink drips/blobs
    ctx.beginPath();
    ctx.ellipse(
      player.position.x - 10,
      player.position.y - 15,
      8,
      10,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(
      player.position.x + 15,
      player.position.y + 10,
      6,
      7,
      Math.PI / 6,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add eyes
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(player.position.x - 5, player.position.y - 5, 4, 0, Math.PI * 2);
    ctx.arc(player.position.x + 8, player.position.y - 8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Add pupils
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(player.position.x - 4, player.position.y - 5, 2, 0, Math.PI * 2);
    ctx.arc(player.position.x + 9, player.position.y - 8, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Slip power effect
    if (player.canSlip) {
      ctx.fillStyle = "rgba(30, 58, 138, 0.3)";
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return (
    <GameLoop
      gameState={gameState}
      canvasSize={canvasSize}
      player={player}
      platforms={platforms}
      enemies={enemies}
      keysPressed={keysPressed}
      movePlayer={movePlayer}
      setGameState={setGameState}
      restoreArea={restoreArea}
      renderFrame={renderFrame}
    />
  );
};

export default GameEngine;
