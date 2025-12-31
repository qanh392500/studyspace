export enum GasProcess {
  Isothermal = 'ISOTHERMAL', // Dang nhiet (Boyle) - T const
  Isobaric = 'ISOBARIC',     // Dang ap (Charles) - P const
  Isochoric = 'ISOCHORIC'    // Dang tich (Gay-Lussac) - V const
}

export interface GasState {
  pressure: number;    // atm
  volume: number;      // Liters
  temperature: number; // Kelvin
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}