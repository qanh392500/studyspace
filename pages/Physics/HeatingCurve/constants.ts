import { Phase, SimulationState } from './types';

// Physics Constants for 1kg of Water
export const MASS = 1; // kg
export const C_ICE = 2100; // J/kg.K
export const C_WATER = 4200; // J/kg.K
export const L_FUSION = 334000; // J/kg (Latent heat of fusion)
export const L_VAPOR = 2260000; // J/kg (Latent heat of vaporization)
export const T_START = -20; // Celsius
export const T_MELT = 0; // Celsius
export const T_BOIL = 100; // Celsius

// Energy Thresholds
// Q1: Energy to reach 0°C from -20°C
export const Q_TO_MELT_START = MASS * C_ICE * (T_MELT - T_START);

// Q2: Energy to complete melting
export const Q_TO_MELT_END = Q_TO_MELT_START + (MASS * L_FUSION);

// Q3: Energy to reach 100°C from 0°C
export const Q_TO_BOIL_START = Q_TO_MELT_END + (MASS * C_WATER * (T_BOIL - T_MELT));

// Q4: Energy to complete boiling
export const Q_TO_BOIL_END = Q_TO_BOIL_START + (MASS * L_VAPOR);


export const calculateState = (totalEnergy: number): SimulationState => {
  let temperature = T_START;
  let phase = Phase.SOLID;
  let meltFraction = 0;
  let boilFraction = 0;

  if (totalEnergy < Q_TO_MELT_START) {
    // Phase 1: Heating Ice
    phase = Phase.SOLID;
    const deltaT = totalEnergy / (MASS * C_ICE);
    temperature = T_START + deltaT;
  } else if (totalEnergy < Q_TO_MELT_END) {
    // Phase 2: Melting
    phase = Phase.MELTING;
    temperature = T_MELT;
    const energyInPhase = totalEnergy - Q_TO_MELT_START;
    meltFraction = energyInPhase / (MASS * L_FUSION);
  } else if (totalEnergy < Q_TO_BOIL_START) {
    // Phase 3: Heating Water
    phase = Phase.LIQUID;
    meltFraction = 1;
    const energyInPhase = totalEnergy - Q_TO_MELT_END;
    const deltaT = energyInPhase / (MASS * C_WATER);
    temperature = T_MELT + deltaT;
  } else if (totalEnergy < Q_TO_BOIL_END) {
    // Phase 4: Boiling
    phase = Phase.BOILING;
    meltFraction = 1;
    temperature = T_BOIL;
    const energyInPhase = totalEnergy - Q_TO_BOIL_START;
    boilFraction = energyInPhase / (MASS * L_VAPOR);
  } else {
    // Phase 5: Superheated Steam (Limit simulation here or continue)
    phase = Phase.BOILING; // Keep visual as boiling
    meltFraction = 1;
    boilFraction = 1;
    temperature = T_BOIL; // Cap at 100 for this simulation scope
  }

  return {
    time: 0, // Calculated externally
    energy: totalEnergy,
    temperature,
    phase,
    meltFraction,
    boilFraction,
  };
};