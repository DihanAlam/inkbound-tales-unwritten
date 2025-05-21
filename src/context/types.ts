
// Game state and type definitions
export type GameState = "start" | "playing" | "paused" | "gameover";
export type PageType = "fantasy" | "scifi" | "noir" | "horror" | "romance";

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  position: Position;
  velocity: Position;
  isJumping: boolean;
  canSlip: boolean;
  powers: {
    slip: boolean;
    rewind: boolean;
    blot: boolean;
  };
}

export interface Enemy {
  id: string;
  position: Position;
  size: number;
  defeated: boolean;
  corrupted: boolean;
  movementPattern: "horizontal" | "vertical" | "follow" | "stationary";
  speed: number;
  direction: 1 | -1;
}

export interface Platform {
  id: string;
  position: Position;
  width: number;
  height: number;
  type: "solid" | "crack";
}

export interface GameContextType {
  gameState: GameState;
  currentPage: PageType;
  player: Player;
  enemies: Enemy[];
  platforms: Platform[];
  restoredAreas: string[];
  score: number;
  timeState: number;
  canvasSize: { width: number; height: number };
  setGameState: (state: GameState) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  movePlayer: (direction: "left" | "right" | "up" | "none") => void;
  useInkPower: (power: "slip" | "rewind" | "blot") => void;
  restoreArea: (areaId: string) => void;
}
