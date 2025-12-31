import React, { useRef, useEffect } from 'react';
import { Phase } from '../types';

interface MicroViewProps {
  temperature: number;
  phase: Phase;
  meltFraction: number;
  boilFraction: number;
}

// --- Physics Constants ---
const CANVAS_SIZE = 280;
const CENTER = CANVAS_SIZE / 2;
const CONTAINER_RADIUS = 130;
const PARTICLE_RADIUS = 6;
const PARTICLE_COUNT = 91; // Hexagonal number for pretty packing
const GRAVITY = 0.15;
const DAMPING = 0.98; // General air resistance
const WALL_ELASTICITY = 0.7; // Wall energy loss (for liquid/solid)
const GAS_ELASTICITY = 1.0; // Gas bounces perfectly

class Particle {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;
  anchorX: number;
  anchorY: number;
  id: number;

  constructor(id: number, anchorX: number, anchorY: number) {
    this.id = id;
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.x = anchorX;
    this.y = anchorY;
  }
}

const MicroView: React.FC<MicroViewProps> = ({ temperature, phase, meltFraction, boilFraction }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Initialize Particles in Centered Hexagonal Grid
  useEffect(() => {
    const particles: Particle[] = [];
    const spacing = PARTICLE_RADIUS * 2.6; // Distance between particle centers
    const hexHeight = spacing * 0.866; // height of equilateral triangle row

    // Generate potential points centered at (0,0) then translate to CENTER
    const candidates: {x: number, y: number, d2: number}[] = [];
    
    // Scan a grid large enough to cover the circle
    const range = Math.ceil(CONTAINER_RADIUS / hexHeight) + 1;

    for (let r = -range; r <= range; r++) {
      for (let c = -range; c <= range; c++) {
        // Hexagonal Offset: Shift every other row by half spacing
        const xOffset = (r % 2) * (spacing / 2);
        
        let x = c * spacing + xOffset;
        let y = r * hexHeight;

        const d2 = x*x + y*y;
        
        // Check if inside container (with margin for radius)
        if (d2 < (CONTAINER_RADIUS - PARTICLE_RADIUS * 2) ** 2) {
          candidates.push({
            x: x + CENTER,
            y: y + CENTER,
            d2: d2
          });
        }
      }
    }

    // Key Step: Sort by distance from center to fill inside-out
    candidates.sort((a, b) => a.d2 - b.d2);

    // Take the first N particles
    const selected = candidates.slice(0, PARTICLE_COUNT);

    selected.forEach((pt, i) => {
       particles.push(new Particle(i, pt.x, pt.y));
    });

    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // 1. Clear & Draw Container
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      // Background (Always white inside the lens for clarity)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Lens Border
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, CONTAINER_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#94a3b8'; // slate-400
      ctx.stroke();

      // Clip for content
      ctx.save();
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, CONTAINER_RADIUS - 4, 0, Math.PI * 2);
      ctx.clip();

      const particles = particlesRef.current;
      
      // Temperature affects vibration (Solid) or speed (Gas)
      const tFactor = (temperature + 20) / 120; // Normalize approx 0 to 1
      const vibration = 0.5 + tFactor * 2.0; 
      const gasSpeed = 2.0 + tFactor * 5.0;

      // 2. Physics Update Loop
      particles.forEach((p, i) => {
        
        // --- A. DETERMINE STATE ---
        let isSolid = false;
        let isGas = false;
        
        if (phase === Phase.SOLID) {
            isSolid = true;
        } else if (phase === Phase.MELTING) {
            const threshold = Math.floor(particles.length * (1 - meltFraction));
            isSolid = i < threshold; 
        } else if (phase === Phase.LIQUID) {
            isSolid = false;
        } else if (phase === Phase.BOILING) {
            const threshold = Math.floor(particles.length * boilFraction);
            isGas = i < threshold;
        }

        // --- B. APPLY FORCES ---

        if (isSolid) {
            // SOLID: Hooke's Law (Spring Force to Anchor)
            const k = 0.1; // Spring stiffness
            const dx = p.anchorX - p.x;
            const dy = p.anchorY - p.y;
            
            p.vx += dx * k;
            p.vy += dy * k;
            
            // Damping (Friction) to stop oscillation
            p.vx *= 0.8;
            p.vy *= 0.8;

            // Thermal Jitter
            p.vx += (Math.random() - 0.5) * vibration;
            p.vy += (Math.random() - 0.5) * vibration;

        } else if (isGas) {
            // GAS: No Gravity, High Speed
            const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
            if (speed < gasSpeed) {
                p.vx *= 1.1;
                p.vy *= 1.1;
            }
            // Cap speed
            if (speed > gasSpeed * 2) {
                p.vx *= 0.9;
                p.vy *= 0.9;
            }
            
        } else {
            // LIQUID: Gravity + Fluid Dynamics
            p.vy += GRAVITY;
            p.vx *= DAMPING;
            p.vy *= DAMPING;

            // Thermal movement in liquid
            p.vx += (Math.random() - 0.5) * (vibration * 0.5);
            p.vy += (Math.random() - 0.5) * (vibration * 0.5);
        }

        // --- C. UPDATE POSITION ---
        p.x += p.vx;
        p.y += p.vy;

        // --- D. PARTICLE-PARTICLE COLLISION (Liquid Only) ---
        if (!isSolid && !isGas) {
             for (let j = i + 1; j < particles.length; j++) {
                 const other = particles[j];
                 
                 const dx = p.x - other.x;
                 const dy = p.y - other.y;
                 const d2 = dx*dx + dy*dy;
                 const minDist = PARTICLE_RADIUS * 2 + 1; // +1 spacing
                 
                 if (d2 < minDist * minDist && d2 > 0) {
                     const dist = Math.sqrt(d2);
                     const nx = dx / dist;
                     const ny = dy / dist;
                     
                     const overlap = (minDist - dist) * 0.5;
                     p.x += nx * overlap;
                     p.y += ny * overlap;
                     other.x -= nx * overlap;
                     other.y -= ny * overlap;

                     const avgVx = (p.vx + other.vx) / 2;
                     const avgVy = (p.vy + other.vy) / 2;
                     p.vx = avgVx + nx * 0.1; 
                     p.vy = avgVy + ny * 0.1;
                     other.vx = avgVx - nx * 0.1;
                     other.vy = avgVy - ny * 0.1;
                 }
             }
        }

        // --- E. WALL COLLISION (Circle) ---
        const dx = p.x - CENTER;
        const dy = p.y - CENTER;
        const distSq = dx*dx + dy*dy;
        const dist = Math.sqrt(distSq);
        
        if (dist + PARTICLE_RADIUS > CONTAINER_RADIUS) {
            const nx = dx / dist;
            const ny = dy / dist;

            p.x = CENTER + nx * (CONTAINER_RADIUS - PARTICLE_RADIUS);
            p.y = CENTER + ny * (CONTAINER_RADIUS - PARTICLE_RADIUS);

            const dotProduct = p.vx * nx + p.vy * ny;
            
            if (dotProduct > 0) {
                p.vx = p.vx - 2 * dotProduct * nx;
                p.vy = p.vy - 2 * dotProduct * ny;

                const elasticity = isGas ? GAS_ELASTICITY : WALL_ELASTICITY;
                p.vx *= elasticity;
                p.vy *= elasticity;
            }
        }

        // --- F. DRAW PARTICLE ---
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, Math.PI * 2);
        
        if (isSolid) ctx.fillStyle = '#3b82f6'; // Solid Blue
        else if (isGas) ctx.fillStyle = '#94a3b8'; // Steam Grey
        else ctx.fillStyle = '#60a5fa'; // Liquid Light Blue

        ctx.fill();
      });
      
      ctx.restore(); // End Clip

      // Label inside lens
      ctx.fillStyle = 'rgba(100, 116, 139, 0.2)';
      ctx.font = '900 60px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const label = phase === Phase.SOLID ? 'RẮN' : phase === Phase.MELTING ? 'TAN' : phase === Phase.LIQUID ? 'LỎNG' : 'KHÍ';
      ctx.fillText(label, CENTER, CENTER);

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [temperature, phase, meltFraction, boilFraction]);

  return (
    <div className="relative flex flex-col items-center">
      <h4 className="font-bold text-slate-600 dark:text-slate-300 mb-2">Cấu trúc Vi mô (Kính lúp)</h4>
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE} 
        className="rounded-full bg-white shadow-xl border-4 border-slate-300 dark:border-slate-600 cursor-zoom-in max-w-full"
      />
    </div>
  );
};

export default MicroView;