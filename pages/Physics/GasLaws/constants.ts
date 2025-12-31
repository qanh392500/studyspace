import { GasProcess } from "./types";

export const IDEAL_GAS_CONSTANT = 0.0821; // L⋅atm⋅K−1⋅mol−1
export const MOLES = 1; // Assuming 1 mole of gas for simplicity

// Limits
export const MIN_TEMP = 100; // Kelvin
export const MAX_TEMP = 600; // Kelvin

export const MIN_VOL = 10; // Liters
export const MAX_VOL = 100; // Liters

export const MAX_PRESSURE_WARNING = 3.5; // atm

// Visual Constants
export const CANVAS_WIDTH = 300;
export const CANVAS_HEIGHT = 400;
export const PARTICLE_COUNT = 40;
export const PARTICLE_RADIUS = 3;

// Process Colors & Configs
export const PROCESS_CONFIG = {
  [GasProcess.Isothermal]: {
    name: "Đẳng Nhiệt (Boyle)",
    color: "text-green-600 dark:text-green-500",
    borderColor: "border-green-500",
    bgAccent: "bg-green-500",
    description: "Nhiệt độ (T) không đổi. p ~ 1/V"
  },
  [GasProcess.Isobaric]: {
    name: "Đẳng Áp (Charles)",
    color: "text-orange-600 dark:text-orange-500",
    borderColor: "border-orange-500",
    bgAccent: "bg-orange-500",
    description: "Áp suất (p) không đổi. V ~ T"
  },
  [GasProcess.Isochoric]: {
    name: "Đẳng Tích (Gay-Lussac)",
    color: "text-red-600 dark:text-red-500",
    borderColor: "border-red-500",
    bgAccent: "bg-red-500",
    description: "Thể tích (V) không đổi. p ~ T"
  }
};