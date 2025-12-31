export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export type HeatSourceType = 'none' | 'fire' | 'ice';

export const CONSTANTS = {
  MIN_HEIGHT: 20,
  MAX_HEIGHT: 180,
  CYLINDER_WIDTH: 200,
  PARTICLE_COUNT: 40,
  BASE_PRESSURE: 100, // Arbitrary unit
};