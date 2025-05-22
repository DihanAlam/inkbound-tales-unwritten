
import React from "react";
import { Player } from "@/context/types";

interface PlayerRendererProps {
  player: Player;
  ctx: CanvasRenderingContext2D;
}

const PlayerRenderer: React.FC<PlayerRendererProps> = ({ player, ctx }) => {
  React.useEffect(() => {
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
  }, [player, ctx]);

  return null;
};

export default PlayerRenderer;
