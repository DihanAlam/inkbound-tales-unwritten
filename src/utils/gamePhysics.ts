import { Player, Platform, Enemy } from "@/context/types";

export const updatePlayerPhysics = (
  player: Player, 
  platforms: Platform[], 
  canvasSize: { width: number; height: number }
): Player => {
  const newPlayer = { ...player };
  
  // Update player position
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
  
  return newPlayer;
};

export const updateEnemyPositions = (
  enemies: Enemy[],
  platforms: Platform[],
  player: Player,
  canvasSize: { width: number; height: number }
): Enemy[] => {
  return enemies.map((enemy) => {
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
};

export const checkEnemyCollisions = (
  player: Player,
  enemies: Enemy[],
  restoreArea: (areaId: string) => void
): { player: Player, gameOver: boolean } => {
  let newPlayer = { ...player };
  let gameOver = false;
  
  enemies.forEach((enemy) => {
    if (
      !enemy.defeated &&
      Math.hypot(
        player.position.x - enemy.position.x,
        player.position.y - enemy.position.y
      ) < enemy.size + 20
    ) {
      // If player is falling onto the enemy, defeat it
      if (player.velocity.y > 0 && player.position.y < enemy.position.y) {
        restoreArea(enemy.id);
        newPlayer = { 
          ...newPlayer, 
          velocity: { 
            ...newPlayer.velocity, 
            y: -10 
          } 
        }; // Bounce off enemy
      } else if (enemy.corrupted) {
        // Game over if touching a corrupted enemy from the sides
        gameOver = true;
      }
    }
  });
  
  return { player: newPlayer, gameOver };
};
