
import { Position } from "@/context/types";

interface Rect {
  position: Position;
  width: number;
  height: number;
}

export const checkCollision = (rect1: Rect, rect2: Rect): boolean => {
  return (
    rect1.position.x < rect2.position.x + rect2.width &&
    rect1.position.x + rect1.width > rect2.position.x &&
    rect1.position.y < rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height > rect2.position.y
  );
};
