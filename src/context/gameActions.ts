
import { GameState, PageType, Player } from './types';
import { toast } from "sonner";

export function useGameActions() {
  const startGame = (
    setGameState: (state: GameState) => void,
    setPlayer: (player: Player) => void,
    setPlatforms: (platforms: any[]) => void,
    setEnemies: (enemies: any[]) => void,
    setRestoredAreas: (areas: string[]) => void,
    setScore: (score: number) => void,
    setTimeState: (time: number) => void,
    defaultPlayer: Player,
    initialPlatforms: any[],
    initialEnemies: any[]
  ) => {
    console.log("Starting game with new state...");
    // Force state reset
    setGameState("playing");
    setPlayer({ ...defaultPlayer });
    setPlatforms([...initialPlatforms]);
    setEnemies([...initialEnemies]);
    setRestoredAreas([]);
    setScore(0);
    setTimeState(0);
    toast("Welcome to Inkbound! Use arrow keys to move, space to jump, and 'S' to use slip power");
  };

  const pauseGame = (
    gameState: GameState,
    setGameState: (state: GameState) => void,
    gameLoop: number | null,
    setGameLoop: (id: number | null) => void
  ) => {
    if (gameState === "playing") {
      console.log("Pausing game...");
      setGameState("paused");
      if (gameLoop) {
        cancelAnimationFrame(gameLoop);
        setGameLoop(null);
      }
    }
  };

  const resumeGame = (
    gameState: GameState,
    setGameState: (state: GameState) => void
  ) => {
    if (gameState === "paused") {
      console.log("Resuming game...");
      setGameState("playing");
    }
  };

  const restartGame = (
    gameState: GameState,
    startGameFn: () => void
  ) => {
    console.log("Restarting game from gameState:", gameState);
    // Call startGame regardless of current gameState to ensure restart works from any state
    startGameFn();
  };

  const movePlayer = (
    direction: "left" | "right" | "up" | "none",
    gameState: GameState,
    setPlayer: (callback: (prev: Player) => Player) => void
  ) => {
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

  const useInkPower = (
    power: "slip" | "rewind" | "blot",
    gameState: GameState,
    player: Player,
    setPlayer: (callback: (prev: Player) => Player) => void
  ) => {
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

  const restoreArea = (
    areaId: string,
    restoredAreas: string[],
    setRestoredAreas: (callback: (prev: string[]) => string[]) => void,
    setScore: (callback: (prev: number) => number) => void,
    setEnemies: (callback: (prev: any[]) => any[]) => void
  ) => {
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

  return {
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    movePlayer,
    useInkPower,
    restoreArea
  };
}
