export enum MatterState {
  SOLID = 'SOLID',
  LIQUID = 'LIQUID',
  GAS = 'GAS'
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  color: string;
  isPollen: boolean;
  // For Solid State Logic
  baseX?: number;
  baseY?: number;
  phaseOffset?: number; // Randomize vibration timing
}

export interface SimulationConfig {
  temperature: number; // Kelvin 0 - 1000
  matterState: MatterState;
  showPollen: boolean;
}