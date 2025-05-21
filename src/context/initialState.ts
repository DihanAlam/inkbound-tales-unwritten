
import { Player, Platform, Enemy } from './types';

export const defaultPlayer: Player = {
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

export const initialPlatforms: Platform[] = [
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

export const initialEnemies: Enemy[] = [
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
