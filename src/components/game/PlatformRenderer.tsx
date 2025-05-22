
import React from "react";
import { Platform } from "@/context/types";

interface PlatformRendererProps {
  platforms: Platform[];
  ctx: CanvasRenderingContext2D;
}

const PlatformRenderer: React.FC<PlatformRendererProps> = ({ platforms, ctx }) => {
  React.useEffect(() => {
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
  }, [platforms, ctx]);

  return null;
};

export default PlatformRenderer;
