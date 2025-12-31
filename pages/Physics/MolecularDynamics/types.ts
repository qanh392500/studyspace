export interface Vector2 {
  x: number;
  y: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  isHighlighted: boolean;
}

export interface WallCollisionEvent {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  timestamp: number;
}