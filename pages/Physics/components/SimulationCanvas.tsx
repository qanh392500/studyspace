import React, { useRef, useEffect, useState } from 'react';
import { Particle, MatterState, SimulationConfig } from '../types';
import { resolveCollision, getParticleColor, getBaseSpeed } from '../utils/physicsUtils';
import AnnotationPanel from './AnnotationPanel';
import { useTheme } from '../../../contexts/ThemeContext';

interface Props {
  config: SimulationConfig;
}

const PARTICLE_COUNT = 150;
const PARTICLE_RADIUS = 6;
const POLLEN_RADIUS = 30;

const stateTranslations: Record<MatterState, string> = {
  [MatterState.SOLID]: 'RẮN',
  [MatterState.LIQUID]: 'LỎNG',
  [MatterState.GAS]: 'KHÍ'
};

const SimulationCanvas: React.FC<Props> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { theme } = useTheme(); // Get current theme

  // Ref to hold theme for use inside animation loop without triggering re-renders of the loop itself
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  
  // Initialize particles logic
  const initParticles = (width: number, height: number, forceGrid: boolean) => {
    // Avoid initializing if dimensions are invalid
    if (width <= 0 || height <= 0) return;

    const particles: Particle[] = [];
    
    // Grid settings for Solid
    const cols = Math.floor(Math.sqrt(PARTICLE_COUNT));
    const spacingX = width / (cols + 2);
    const spacingY = height / (cols + 2);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let x, y;

      if (forceGrid) {
        // Arrange in a grid for Solid
        const col = i % cols;
        const row = Math.floor(i / cols);
        x = spacingX * (col + 1);
        y = spacingY * (row + 1);
      } else {
        // Random for Gas/Liquid
        x = Math.random() * (width - 20) + 10;
        y = Math.random() * (height - 20) + 10;
      }

      particles.push({
        id: i,
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: PARTICLE_RADIUS,
        mass: 1, // Standard molecule mass
        color: 'blue',
        isPollen: false,
        baseX: x,
        baseY: y,
        phaseOffset: Math.random() * Math.PI * 2
      });
    }
    particlesRef.current = particles;
  };

  // Re-initialize particles when switching TO solid to ensure they snap to grid
  useEffect(() => {
    if (config.matterState === MatterState.SOLID && dimensions.width > 0) {
        initParticles(dimensions.width, dimensions.height, true);
    } 
  }, [config.matterState, dimensions]);

  // Handle Resize and Initial Setup using ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        
        if (width > 0 && height > 0) {
            setDimensions({ width, height });

            // Update Canvas Resolution
            const canvas = canvasRef.current;
            if (canvas) {
               const dpr = window.devicePixelRatio || 1;
               canvas.width = width * dpr;
               canvas.height = height * dpr;
               
               const ctx = canvas.getContext('2d');
               if (ctx) ctx.scale(dpr, dpr);
               
               // Re-init if needed
               if (particlesRef.current.length === 0 || config.matterState === MatterState.SOLID) {
                  initParticles(width, height, config.matterState === MatterState.SOLID);
               }
            }
        }
      }
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [config.matterState]); 

  // Check for Pollen Particle
  useEffect(() => {
    const particles = particlesRef.current;
    if (dimensions.width === 0) return;

    const hasPollen = particles.some(p => p.isPollen);

    if (config.showPollen && !hasPollen) {
        // Add pollen to the middle
        particles.push({
            id: 9999,
            x: dimensions.width / 2,
            y: dimensions.height / 2,
            vx: 0,
            vy: 0,
            radius: POLLEN_RADIUS,
            mass: 20, // Much heavier
            color: '#FACC15', // Yellow-400
            isPollen: true,
            baseX: dimensions.width / 2,
            baseY: dimensions.height / 2
        });
    } else if (!config.showPollen && hasPollen) {
        // Remove pollen
        particlesRef.current = particles.filter(p => !p.isPollen);
    }
  }, [config.showPollen, dimensions]);

  // Main Animation Loop
  const animate = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = dimensions.width;
    const height = dimensions.height;

    if (width === 0 || height === 0) {
        requestRef.current = requestAnimationFrame(animate);
        return;
    }

    // Clear Screen
    ctx.clearRect(0, 0, width, height);
    
    // Background gradient based on theme
    const isDark = themeRef.current === 'dark';
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    
    if (isDark) {
        bgGradient.addColorStop(0, '#1e293b'); // slate-800
        bgGradient.addColorStop(1, '#0f172a'); // slate-950
    } else {
        bgGradient.addColorStop(0, '#f8fafc'); // slate-50
        bgGradient.addColorStop(1, '#e2e8f0'); // slate-200
    }
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    const particles = particlesRef.current;
    const baseSpeed = getBaseSpeed(config.temperature);
    const particleColor = getParticleColor(config.temperature, isDark);

    // --- PHYSICS LOOP ---
    particles.forEach(p => {
      
      // 1. UPDATE POSITIONS
      if (p.isPollen) {
         p.x += p.vx;
         p.y += p.vy;
         
         // Pollen Bounds
         if (p.x - p.radius < 0) { p.x = p.radius; p.vx *= -1; }
         if (p.x + p.radius > width) { p.x = width - p.radius; p.vx *= -1; }
         if (p.y - p.radius < 0) { p.y = p.radius; p.vy *= -1; }
         if (p.y + p.radius > height) { p.y = height - p.radius; p.vy *= -1; }

         p.vx *= 0.99;
         p.vy *= 0.99;
         
         if (config.matterState === MatterState.LIQUID) {
             p.vy += 0.05;
         }

      } else {
        p.color = particleColor;

        if (config.matterState === MatterState.SOLID) {
          const vibrationAmplitude = config.temperature * 0.005; 
          const vibrationSpeed = 0.2;
          const t = time * 0.01; 
          
          const offsetX = Math.sin(t * vibrationSpeed + (p.phaseOffset || 0)) * vibrationAmplitude;
          const offsetY = Math.cos(t * vibrationSpeed + (p.phaseOffset || 0)) * vibrationAmplitude;

          p.x = (p.baseX || p.x) + offsetX;
          p.y = (p.baseY || p.y) + offsetY;
          
          p.vx = (Math.random() - 0.5) * baseSpeed;
          p.vy = (Math.random() - 0.5) * baseSpeed;

        } else {
          const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const targetSpeed = baseSpeed + (Math.random() * 0.5);
          
          if (currentSpeed === 0) {
              p.vx = (Math.random() - 0.5);
              p.vy = (Math.random() - 0.5);
          } else {
              const adjustment = 0.1;
              const scale = (targetSpeed / currentSpeed) * adjustment + (1 - adjustment);
              p.vx *= scale;
              p.vy *= scale;
          }

          if (config.matterState === MatterState.LIQUID) {
            p.vy += 0.15;
          }

          p.x += p.vx;
          p.y += p.vy;

          const wallDamping = config.matterState === MatterState.LIQUID ? 0.6 : 1;

          if (p.x - p.radius < 0) {
            p.x = p.radius;
            p.vx *= -1;
          } else if (p.x + p.radius > width) {
            p.x = width - p.radius;
            p.vx *= -1;
          }

          if (p.y - p.radius < 0) {
            p.y = p.radius;
            p.vy *= -1;
          } else if (p.y + p.radius > height) {
            p.y = height - p.radius;
            p.vy *= -wallDamping; 
            if (config.matterState === MatterState.LIQUID) {
                p.vx *= 0.95; 
            }
          }
        }
      }

      // 2. DRAW
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      
      if (p.isPollen) {
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = p.color;
      }
      ctx.fill();
      ctx.closePath();
    });

    // 3. COLLISIONS
    if (config.matterState !== MatterState.SOLID || config.showPollen) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i];
                const p2 = particles[j];
                const isBothSolidMolecules = !p1.isPollen && !p2.isPollen && config.matterState === MatterState.SOLID;
                
                if (!isBothSolidMolecules) {
                    resolveCollision(p1, p2);
                }
            }
        }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config.temperature, config.matterState, dimensions]);

  return (
    <div className="w-full h-full flex flex-col border-4 border-slate-300 dark:border-slate-700 rounded-lg shadow-inner bg-slate-50 dark:bg-slate-900 overflow-hidden relative transition-colors">
      <div ref={containerRef} className="flex-grow relative w-full h-full min-h-0">
         <canvas
            ref={canvasRef}
            className="block w-full h-full touch-none"
            style={{ width: '100%', height: '100%' }}
         />
        <div className="absolute top-4 left-4 pointer-events-none opacity-10">
            <h2 className="text-6xl font-black text-slate-800 dark:text-white uppercase tracking-widest">
                {stateTranslations[config.matterState]}
            </h2>
        </div>
      </div>
      <AnnotationPanel state={config.matterState} />
    </div>
  );
};

export default SimulationCanvas;