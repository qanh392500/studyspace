import { Particle } from '../types';

/**
 * Resolves elastic collision between two particles.
 * Updates velocities in place based on conservation of momentum and energy.
 */
export const resolveCollision = (p1: Particle, p2: Particle) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < p1.radius + p2.radius) {
    // 1. Resolve Overlap (prevent sticking)
    const overlap = 0.5 * (distance - p1.radius - p2.radius);
    const offsetX = overlap * (dx / distance);
    const offsetY = overlap * (dy / distance);

    p1.x += offsetX;
    p1.y += offsetY;
    p2.x -= offsetX;
    p2.y -= offsetY;

    // 2. Resolve Velocity (Elastic Collision)
    const nx = dx / distance; // Normal vector x
    const ny = dy / distance; // Normal vector y

    // Tangent vector
    const tx = -ny;
    const ty = nx;

    // Dot Product Tangent
    const dpTan1 = p1.vx * tx + p1.vy * ty;
    const dpTan2 = p2.vx * tx + p2.vy * ty;

    // Dot Product Normal
    const dpNorm1 = p1.vx * nx + p1.vy * ny;
    const dpNorm2 = p2.vx * nx + p2.vy * ny;

    // Conservation of momentum in 1D
    const m1 = p1.mass;
    const m2 = p2.mass;

    const momentum1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
    const momentum2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

    // Update velocities
    p1.vx = tx * dpTan1 + nx * momentum1;
    p1.vy = ty * dpTan1 + ny * momentum1;
    p2.vx = tx * dpTan2 + nx * momentum2;
    p2.vy = ty * dpTan2 + ny * momentum2;
  }
};

/**
 * Interpolates color from Blue (Cold) to Red (Hot) based on temperature/speed.
 * Temp range assumed 0 to 1000.
 */
export const getParticleColor = (temp: number, isDark: boolean = false): string => {
  // Normalize temp 0-1000 to 0-1
  const t = Math.min(Math.max(temp / 1000, 0), 1);
  
  // Interpolate RGB
  // Cold (Blue-ish) -> Hot (Red)
  // Adjust brightness based on dark mode for better visibility
  const baseR = 50, baseG = 100, baseB = 255;
  const hotR = 255, hotG = 50, hotB = 50;

  let r = Math.round(baseR + (hotR - baseR) * t);
  let g = Math.round(baseG + (hotG - baseG) * t); 
  let b = Math.round(baseB + (hotB - baseB) * t);

  if (isDark) {
    // Make colors brighter/more neon in dark mode
    r = Math.min(255, r + 40);
    g = Math.min(255, g + 40);
    b = Math.min(255, b + 40);
  }

  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * Calculates speed scalar based on Temperature.
 * Kinetic Energy ~ Temperature => v^2 ~ T => v ~ sqrt(T)
 */
export const getBaseSpeed = (temp: number): number => {
  // Base speed factor. Adjust multiplier to look good on canvas.
  // At 0K -> 0 speed. At 1000K -> High speed.
  return Math.sqrt(temp) * 0.15;
};