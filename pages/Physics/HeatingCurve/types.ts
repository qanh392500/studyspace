export enum Phase {
  SOLID = 'SOLID',
  MELTING = 'MELTING',
  LIQUID = 'LIQUID',
  BOILING = 'BOILING',
}

export interface SimulationState {
  time: number;       // Simulation time in seconds
  energy: number;     // Total energy added in Joules
  temperature: number; // Current temperature in Celsius
  phase: Phase;
  meltFraction: number; // 0 to 1 (during melting)
  boilFraction: number; // 0 to 1 (during boiling)
}

export interface GraphPoint {
  time: number;
  temperature: number;
}