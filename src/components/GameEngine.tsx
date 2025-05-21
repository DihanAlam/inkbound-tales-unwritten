import React, { useEffect, useRef } from "react";
import { useGameContext, Position, Platform, Enemy } from "@/context/GameContext";

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
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const lastTime = useRef<number>(0);

  // Collision detection helper
  const checkCollision = (rect1: { position: Position; width: number; height: number }, 
                          rect2: { position: Position; width: number; height: number }) => {
    return (
      rect1.position.x < rect2.position.x + rect2.width &&
      rect1.position.x + rect1.width > rect2.position.x &&
      rect1.position.y < rect2.position.y + rect2.height &&
      rect1.position.y + rect1.height > rect2.position.y
    );
  };

  // Draw game elements
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    
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
    
    // Draw player (inkblot)
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

  // Update game state
  const update = (timestamp: number) => {
    if (gameState !== "playing") return;
    
    const deltaTime = timestamp - lastTime.current;
    lastTime.current = timestamp;
    
    // Player movement based on keys pressed
    if (keysPressed.current.ArrowLeft || keysPressed.current.a) {
      movePlayer("left");
    } else if (keysPressed.current.ArrowRight || keysPressed.current.d) {
      movePlayer("right");
    } else {
      movePlayer("none");
    }
    
    if (
      (keysPressed.current.ArrowUp || keysPressed.current.w || keysPressed.current[" "]) &&
      !player.isJumping
    ) {
      movePlayer("up");
    }
    
    // Update player position
    const newPlayer = { ...player };
    newPlayer.position.x += player.velocity.x;
    newPlayer.position.y += player.velocity.y;
    
    // Apply gravity
    newPlayer.velocity.y += 0.6; // gravity
    
    // Check platform collisions
    let onGround = false;
    for (const platform of platforms) {
      // Skip crack platforms if player can slip through
      if (platform.type === "crack" && player.canSlip) continue;
      
      if (
        newPlayer.velocity.y > 0 && // falling
        newPlayer.position.y + 25 < platform.position.y &&
        newPlayer.position.y + 25 + newPlayer.velocity.y >= platform.position.y &&
        newPlayer.position.x + 15 > platform.position.x &&
        newPlayer.position.x - 15 < platform.position.x + platform.width
      ) {
        newPlayer.position.y = platform.position.y - 25;
        newPlayer.velocity.y = 0;
        newPlayer.isJumping = false;
        onGround = true;
      }
    }
    
    if (!onGround) {
      newPlayer.isJumping = true;
    }
    
    // Keep player within bounds
    if (newPlayer.position.x < 20) {
      newPlayer.position.x = 20;
    } else if (newPlayer.position.x > canvasSize.width - 20) {
      newPlayer.position.x = canvasSize.width - 20;
    }
    
    // Check for enemy collisions
    enemies.forEach((enemy) => {
      if (
        !enemy.defeated &&
        Math.hypot(
          newPlayer.position.x - enemy.position.x,
          newPlayer.position.y - enemy.position.y
        ) < enemy.size + 20
      ) {
        // If player is falling onto the enemy, defeat it
        if (newPlayer.velocity.y > 0 && newPlayer.position.y < enemy.position.y) {
          restoreArea(enemy.id);
          newPlayer.velocity.y = -10; // Bounce off enemy
        } else if (enemy.corrupted) {
          // Game over if touching a corrupted enemy from the sides
          setGameState("gameover");
        }
      }
    });
    
    // Update enemy positions
    const newEnemies = enemies.map((enemy) => {
      if (enemy.defeated || enemy.movementPattern === "stationary") return enemy;
      
      const newEnemy = { ...enemy };
      
      if (enemy.movementPattern === "horizontal") {
        newEnemy.position.x += enemy.speed * enemy.direction;
        
        // Check if enemy should change direction
        const platformBelow = platforms.find(
          (p) =>
            p.position.y > enemy.position.y &&
            p.position.x < enemy.position.x &&
            p.position.x + p.width > enemy.position.x
        );
        
        if (
          (platformBelow &&
            (enemy.position.x > platformBelow.position.x + platformBelow.width - enemy.size ||
              enemy.position.x < platformBelow.position.x + enemy.size)) ||
          enemy.position.x < enemy.size ||
          enemy.position.x > canvasSize.width - enemy.size
        ) {
          newEnemy.direction = enemy.direction * -1 as 1 | -1;
        }
      }
      
      if (enemy.movementPattern === "vertical") {
        newEnemy.position.y += enemy.speed * enemy.direction;
        
        // Change direction at top/bottom
        if (
          newEnemy.position.y < enemy.size ||
          newEnemy.position.y > canvasSize.height - enemy.size
        ) {
          newEnemy.direction = enemy.direction * -1 as 1 | -1;
        }
      }
      
      if (enemy.movementPattern === "follow" && !enemy.corrupted) {
        // Only non-corrupted enemies follow
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.hypot(dx, dy);
        
        if (distance > 0) {
          newEnemy.position.x += (dx / distance) * enemy.speed;
          newEnemy.position.y += (dy / distance) * enemy.speed;
        }
      }
      
      return newEnemy;
    });
    
    // Check if player fell off the screen
    if (newPlayer.position.y > canvasSize.height) {
      setGameState("gameover");
    }
    
    // Update game state
    if (gameState === "playing") {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      
      if (ctx) {
        // Return updated state
        draw(ctx);
      }
    }
  };

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = (timestamp: number) => {
      update(timestamp);
      animationFrameId = requestAnimationFrame(render);
    };

    if (gameState === "playing") {
      lastTime.current = performance.now();
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, player, platforms, enemies, canvasSize]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      
      // Special key handlers
      if (e.key === "s" || e.key === "S") {
        useGameContext().useInkPower("slip");
      }
      
      if (e.key === "r" || e.key === "R") {
        useGameContext().useInkPower("rewind");
      }
      
      if (e.key === "b" || e.key === "B") {
        useGameContext().useInkPower("blot");
      }
      
      if (e.key === "Escape") {
        if (gameState === "playing") {
          useGameContext().pauseGame();
        } else if (gameState === "paused") {
          useGameContext().resumeGame();
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
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="border border-gray-300 bg-white"
    />
  );
};

export default GameEngine;
