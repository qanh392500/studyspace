import React, { useRef, useEffect, useCallback } from 'react';
import { Particle, WallCollisionEvent } from '../types';

interface PhysicsCanvasProps {
  temperature: number;
  particleCount: number;
  isSlowMotion: boolean;
  onStatsUpdate: (pressure: number, rmsSpeed: number, speeds: number[]) => void;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 450;
const PARTICLE_RADIUS = 4;
const PARTICLE_MASS = 1;

export const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({
  temperature,
  particleCount,
  isSlowMotion,
  onStatsUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Physics Accumulators
  const impulseAccumulatorRef = useRef<number>(0);
  const lastStatsUpdateRef = useRef<number>(0);
  
  // Highlight Visualization
  const highlightCollisionRef = useRef<WallCollisionEvent>({ 
    active: false, x: 0, y: 0, vx: 0, vy: 0, timestamp: 0 
  });

  // Initialization
  const initParticles = useCallback((count: number, temp: number) => {
    const newParticles: Particle[] = [];
    const baseSpeed = Math.sqrt(temp) * 2; // Scaling factor for visual

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Maxwell-like distribution approximation (Box-Muller)
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      
      const speed = baseSpeed * (0.5 + Math.abs(z) * 0.5); // Add variance

      newParticles.push({
        id: i,
        x: PARTICLE_RADIUS + Math.random() * (CANVAS_WIDTH - 2 * PARTICLE_RADIUS),
        y: PARTICLE_RADIUS + Math.random() * (CANVAS_HEIGHT - 2 * PARTICLE_RADIUS),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        mass: PARTICLE_MASS,
        radius: PARTICLE_RADIUS,
        color: i === 0 ? '#ef4444' : '#22d3ee', // Red for highlighted, Cyan for others
        isHighlighted: i === 0
      });
    }
    particlesRef.current = newParticles;
  }, []);

  // Sync Particle Count
  useEffect(() => {
    if (particlesRef.current.length === 0) {
      initParticles(particleCount, temperature);
    } else {
      const currentLen = particlesRef.current.length;
      if (particleCount > currentLen) {
        // Add more
        const toAdd = particleCount - currentLen;
        const baseSpeed = Math.sqrt(temperature) * 2;
        for (let i = 0; i < toAdd; i++) {
            const angle = Math.random() * Math.PI * 2;
            particlesRef.current.push({
                id: currentLen + i,
                x: CANVAS_WIDTH / 2,
                y: CANVAS_HEIGHT / 2,
                vx: Math.cos(angle) * baseSpeed,
                vy: Math.sin(angle) * baseSpeed,
                mass: PARTICLE_MASS,
                radius: PARTICLE_RADIUS,
                color: '#22d3ee',
                isHighlighted: false
            });
        }
      } else if (particleCount < currentLen) {
        // Remove
        particlesRef.current = particlesRef.current.slice(0, particleCount);
        // Ensure index 0 is still highlighted if it exists
        if (particlesRef.current.length > 0) {
           particlesRef.current[0].color = '#ef4444';
           particlesRef.current[0].isHighlighted = true;
        }
      }
    }
  }, [particleCount, temperature, initParticles]);

  // Sync Temperature (Speed Scaling)
  useEffect(() => {
    const currentParticles = particlesRef.current;
    if (currentParticles.length === 0) return;

    const targetAvgSpeedSquared = temperature * 4; 
    
    // Calculate current energy
    let totalSpeedSq = 0;
    currentParticles.forEach(p => totalSpeedSq += (p.vx*p.vx + p.vy*p.vy));
    const currentAvgSpeedSq = totalSpeedSq / currentParticles.length;

    if (currentAvgSpeedSq === 0) return;

    const scaleFactor = Math.sqrt(targetAvgSpeedSquared / currentAvgSpeedSq);

    currentParticles.forEach(p => {
        p.vx *= scaleFactor;
        p.vy *= scaleFactor;
    });

  }, [temperature]);

  const updatePhysics = (dt: number) => {
    const timeScale = isSlowMotion ? 0.2 : 1.0;
    const simDt = dt * timeScale;
    const width = CANVAS_WIDTH;
    const height = CANVAS_HEIGHT;

    particlesRef.current.forEach(p => {
      // Move
      p.x += p.vx * simDt;
      p.y += p.vy * simDt;

      // Wall Collisions
      // Right Wall (Measurement Wall)
      if (p.x > width - p.radius) {
        p.x = width - p.radius;
        p.vx *= -1;
        
        // Impulse = Change in momentum = mv - m(-v) = 2mv
        const impulse = 2 * p.mass * Math.abs(p.vx);
        impulseAccumulatorRef.current += impulse;

        // Highlight Logic
        if (p.isHighlighted && isSlowMotion) {
            highlightCollisionRef.current = {
                active: true,
                x: p.x,
                y: p.y,
                vx: Math.abs(p.vx),
                vy: p.vy,
                timestamp: performance.now()
            };
        }
      } 
      // Left Wall
      else if (p.x < p.radius) {
        p.x = p.radius;
        p.vx *= -1;
      }

      // Top/Bottom
      if (p.y > height - p.radius) {
        p.y = height - p.radius;
        p.vy *= -1;
      } else if (p.y < p.radius) {
        p.y = p.radius;
        p.vy *= -1;
      }
    });

    // Particle-Particle Collisions (Simple Elastic)
    for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p1 = particlesRef.current[i];
            const p2 = particlesRef.current[j];
            
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < p1.radius + p2.radius) {
                const nx = dx / distance;
                const ny = dy / distance;

                const dvx = p2.vx - p1.vx;
                const dvy = p2.vy - p1.vy;
                
                const velAlongNormal = dvx * nx + dvy * ny;

                if (velAlongNormal > 0) continue;

                const jImpulse = -velAlongNormal;

                p1.vx -= jImpulse * nx;
                p1.vy -= jImpulse * ny;
                p2.vx += jImpulse * nx;
                p2.vy += jImpulse * ny;

                const overlap = (p1.radius + p2.radius - distance) / 2;
                p1.x -= overlap * nx;
                p1.y -= overlap * ny;
                p2.x += overlap * nx;
                p2.y += overlap * ny;
            }
        }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, currentTime: number) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Container
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Right Wall Highlight
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH, 0);
    ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Draw Particles
    particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        if (p.isHighlighted) {
            ctx.fillStyle = '#ef4444'; // Red
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ef4444';
        } else {
            ctx.fillStyle = isSlowMotion ? 'rgba(34, 211, 238, 0.3)' : '#22d3ee'; // Cyan
            ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Draw Collision Vectors (Slow Motion Only)
    if (isSlowMotion && highlightCollisionRef.current.active) {
        const { x, y, timestamp } = highlightCollisionRef.current;
        const timeSinceHit = currentTime - timestamp;

        if (timeSinceHit < 2000) {
            drawArrow(ctx, x - 50, y, x, y, '#22c55e', `p = mv`);
            drawArrow(ctx, x, y, x - 50, y + 20, '#f97316', `-p`);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '14px Inter';
            ctx.fillText(`Δp = 2mv`, x - 80, y - 20);
        } else {
            highlightCollisionRef.current.active = false;
        }
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = '12px sans-serif';
    ctx.fillText(label, (fromX + toX)/2, (fromY + toY)/2 - 5);
  };

  const loop = (time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const dt = (time - lastTimeRef.current) / 16.67; 
    lastTimeRef.current = time;

    updatePhysics(dt);
    
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) draw(ctx, time);
    }

    if (time - lastStatsUpdateRef.current > 500) {
        const periodSeconds = 0.5;
        const force = impulseAccumulatorRef.current / periodSeconds;
        const pressure = force / CANVAS_HEIGHT; 
        
        let sumV2 = 0;
        const speeds: number[] = [];
        particlesRef.current.forEach(p => {
            const v2 = p.vx*p.vx + p.vy*p.vy;
            sumV2 += v2;
            speeds.push(Math.sqrt(v2));
        });
        const rmsSpeed = Math.sqrt(sumV2 / particlesRef.current.length) || 0;

        onStatsUpdate(pressure, rmsSpeed, speeds);
        
        impulseAccumulatorRef.current = 0;
        lastStatsUpdateRef.current = time;
    }

    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isSlowMotion]);

  return (
    <div ref={containerRef} className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 w-full flex justify-center">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="block max-w-full h-auto"
      />
      <div className="absolute top-4 left-4 text-xs text-slate-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        Kính Hiển Vi Khí Lý Tưởng (2D)
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-slate-400 bg-black/50 px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
        {particleCount} phân tử
      </div>
    </div>
  );
};