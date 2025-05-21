
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

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

const defaultPlayer: Player = {
  position: { x: 100, y: 100 },
  velocity: { x: 0, y: 0 },
  isJumping: false,
  canSlip: false,
  powers: {
    slip: true,
    rewind: false,
    blot: false,
  },
};

const initialPlatforms: Platform[] = [
  {
    id: "platform-1",
    position: { x: 50, y: 500 },
    width: 200,
    height: 20,
    type: "solid",
  },
  {
    id: "platform-2",
    position: { x: 300, y: 400 },
    width: 150,
    height: 20,
    type: "solid",
  },
  {
    id: "platform-3",
    position: { x: 500, y: 300 },
    width: 200,
    height: 20,
    type: "solid",
  },
  {
    id: "platform-4",
    position: { x: 700, y: 200 },
    width: 150,
    height: 20,
    type: "solid",
  },
  {
    id: "crack-1",
    position: { x: 400, y: 200 },
    width: 60,
    height: 200,
    type: "crack",
  },
];

const initialEnemies: Enemy[] = [
  {
    id: "enemy-1",
    position: { x: 350, y: 370 },
    size: 30,
    defeated: false,
    corrupted: true,
    movementPattern: "horizontal",
    speed: 1,
    direction: 1,
  },
  {
    id: "enemy-2",
    position: { x: 600, y: 270 },
    size: 25,
    defeated: false,
    corrupted: true,
    movementPattern: "stationary",
    speed: 0,
    direction: 1,
  },
];

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentPage, setCurrentPage] = useState<PageType>("fantasy");
  const [player, setPlayer] = useState<Player>({ ...defaultPlayer });
  const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const [restoredAreas, setRestoredAreas] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeState, setTimeState] = useState<number>(0);
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });
  const [gameLoop, setGameLoop] = useState<number | null>(null);
  
  const startGame = () => {
    setGameState("playing");
    setPlayer({ ...defaultPlayer });
    setPlatforms([...initialPlatforms]);
    setEnemies([...initialEnemies]);
    setRestoredAreas([]);
    setScore(0);
    setTimeState(0);
    toast("Welcome to Inkbound! Use arrow keys to move, space to jump, and 'S' to use slip power");
  };

  const pauseGame = () => {
    if (gameState === "playing") {
      setGameState("paused");
      if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        setGameLoop(null);
      }
    }
  };

  const resumeGame = () => {
    if (gameState === "paused") {
      setGameState("playing");
    }
  };

  const restartGame = () => {
    if (gameState === "gameover") {
      startGame();
    }
  };

  const movePlayer = (direction: "left" | "right" | "up" | "none") => {
    if (gameState !== "playing") return;

    setPlayer((prev) => {
      const newPlayer = { ...prev };

      switch (direction) {
        case "left":
          newPlayer.velocity.x = -5;
          break;
        case "right":
          newPlayer.velocity.x = 5;
          break;
        case "up":
          if (!newPlayer.isJumping) {
            newPlayer.velocity.y = -15;
            newPlayer.isJumping = true;
          }
          break;
        case "none":
          newPlayer.velocity.x = 0;
          break;
      }

      return newPlayer;
    });
  };

  const useInkPower = (power: "slip" | "rewind" | "blot") => {
    if (gameState !== "playing") return;

    if (power === "slip" && player.powers.slip) {
      setPlayer((prev) => ({ ...prev, canSlip: true }));
      setTimeout(() => {
        setPlayer((prev) => ({ ...prev, canSlip: false }));
      }, 3000);
      toast("Slip power activated! You can pass through cracks for 3 seconds");
    } else if (power === "rewind" && player.powers.rewind) {
      // Implement rewind mechanic later
      toast("Rewind power not yet available");
    } else if (power === "blot" && player.powers.blot) {
      // Implement blot mechanic later
      toast("Blot power not yet available");
    } else {
      toast("Power not available yet!");
    }
  };

  const restoreArea = (areaId: string) => {
    if (restoredAreas.includes(areaId)) return;
    
    setRestoredAreas((prev) => [...prev, areaId]);
    setScore((prev) => prev + 100);
    toast(`Area restored! +100 points`);

    if (areaId.startsWith("enemy")) {
      setEnemies((prev) =>
        prev.map((enemy) =>
          enemy.id === areaId
            ? { ...enemy, defeated: true, corrupted: false }
            : enemy
        )
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(window.innerWidth - 40, 900);
      const height = Math.min(window.innerHeight - 200, 600);
      setCanvasSize({ width, height });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const gameContextValue: GameContextType = {
    gameState,
    currentPage,
    player,
    enemies,
    platforms,
    restoredAreas,
    score,
    timeState,
    canvasSize,
    setGameState,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    movePlayer,
    useInkPower,
    restoreArea,
  };

  return (
    <GameContext.Provider value={gameContextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
