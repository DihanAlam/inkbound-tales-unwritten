
import React from "react";
import { Enemy } from "@/context/types";

interface EnemyRendererProps {
  enemies: Enemy[];
  ctx: CanvasRenderingContext2D;
}

const EnemyRenderer: React.FC<EnemyRendererProps> = ({ enemies, ctx }) => {
  React.useEffect(() => {
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
  }, [enemies, ctx]);

  return null;
};

export default EnemyRenderer;
