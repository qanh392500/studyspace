import React, { useEffect, useRef, useState } from 'react';
import { MAX_VOL, MIN_VOL, CANVAS_HEIGHT, CANVAS_WIDTH, PARTICLE_COUNT, PARTICLE_RADIUS } from '../constants';
import { GasProcess, Particle } from '../types';
import { Flame, Snowflake, GripHorizontal } from 'lucide-react';

interface CylinderProps {
  volume: number;
  temperature: number;
  processType: GasProcess;
  isHeating: boolean;
  isCooling: boolean;
  onVolumeChange: (newVolume: number) => void;
}

const Cylinder: React.FC<CylinderProps> = ({ volume, temperature, processType, isHeating, isCooling, onVolumeChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Calculate Piston Y position based on Volume
  const pixelsPerLiter = (CANVAS_HEIGHT * 0.9) / MAX_VOL;
  const gasHeight = volume * pixelsPerLiter;
  const pistonY = CANVAS_HEIGHT - gasHeight;

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (processType === GasProcess.Isothermal) {
      setIsDragging(true);
      e.preventDefault(); 
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newRelativeY = e.clientY - rect.top;
      const newGasHeight = CANVAS_HEIGHT - newRelativeY;
      
      let newVol = newGasHeight / pixelsPerLiter;
      
      // Clamp
      if (newVol > MAX_VOL) newVol = MAX_VOL;
      if (newVol < MIN_VOL) newVol = MIN_VOL;
      
      onVolumeChange(newVol);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onVolumeChange, pixelsPerLiter]);


  // Initialize Particles
  useEffect(() => {
    const initParticles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      initParticles.push({
        id: i,
        x: Math.random() * CANVAS_WIDTH,
        y: CANVAS_HEIGHT - (Math.random() * gasHeight),
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      });
    }
    setParticles(initParticles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const speedFactor = Math.sqrt(temperature) * 0.15; 

    const render = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      particles.forEach(p => {
        // Update position
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;

        // Wall Collisions
        if (p.x <= PARTICLE_RADIUS) {
          p.x = PARTICLE_RADIUS;
          p.vx *= -1;
        } else if (p.x >= CANVAS_WIDTH - PARTICLE_RADIUS) {
          p.x = CANVAS_WIDTH - PARTICLE_RADIUS;
          p.vx *= -1;
        }

        // Floor Collision
        if (p.y >= CANVAS_HEIGHT - PARTICLE_RADIUS) {
          p.y = CANVAS_HEIGHT - PARTICLE_RADIUS;
          p.vy *= -1;
        }

        // Piston Collision
        if (p.y <= pistonY + PARTICLE_RADIUS) {
          p.y = pistonY + PARTICLE_RADIUS;
          p.vy *= -1;
        }

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, PARTICLE_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = getParticleColor(processType);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [particles, temperature, pistonY, processType]);

  const getParticleColor = (type: GasProcess) => {
    // Dark/Light mode agnostic colors (vibrant enough for both)
    if (type === GasProcess.Isothermal) return '#22c55e'; // green-500
    if (type === GasProcess.Isobaric) return '#f97316'; // orange-500
    if (type === GasProcess.Isochoric) return '#ef4444'; // red-500
    return '#64748b';
  };

  const isInteractive = processType === GasProcess.Isothermal;

  return (
    <div className="relative flex flex-col items-center justify-end h-full select-none">
      {/* Piston Arm */}
      <div 
        className="w-4 bg-slate-300 dark:bg-slate-500 absolute top-0 z-10 transition-all duration-75 ease-out shadow-inner border-x border-slate-400 dark:border-slate-600"
        style={{ height: `${pistonY}px`, left: '50%', transform: 'translateX(-50%)' }}
      ></div>

      {/* Piston Head (Draggable) */}
      <div 
        onMouseDown={handleMouseDown}
        className={`
          w-[320px] h-8 absolute z-20 rounded-sm shadow-md border-b-2 border-slate-400 dark:border-slate-500 flex items-center justify-center
          transition-all duration-75 ease-out
          ${isInteractive ? 'cursor-ns-resize hover:bg-slate-200 dark:hover:bg-slate-400 active:bg-slate-300' : 'cursor-default'}
          bg-gradient-to-r from-slate-200 via-white to-slate-200 dark:from-slate-400 dark:via-slate-300 dark:to-slate-400
        `}
        style={{ top: `${pistonY - 8}px` }}
      >
        <div className="flex flex-col items-center">
           <GripHorizontal className={`w-4 h-4 text-slate-500 dark:text-slate-700 ${isInteractive ? 'opacity-100' : 'opacity-0'}`} />
           <div className="text-[8px] text-slate-500 dark:text-slate-800 font-bold tracking-widest uppercase leading-none">Piston</div>
        </div>
      </div>

      {/* Cylinder Body Container - Ref for drag calculation */}
      <div 
        ref={containerRef}
        className="relative border-x-4 border-b-4 border-slate-400 dark:border-slate-500 bg-white/50 dark:bg-slate-800/50 rounded-b-xl overflow-hidden backdrop-blur-sm" 
        style={{ width: `${CANVAS_WIDTH + 8}px`, height: `${CANVAS_HEIGHT + 4}px` }}
      >
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
               backgroundSize: '20px 20px',
               color: '#94a3b8'
             }}>
        </div>

        {/* Canvas for Particles */}
        <canvas 
          ref={canvasRef} 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT}
          className="absolute bottom-0 left-0 pointer-events-none"
        />
        
        {/* Visual feedback for dragging */}
        {isDragging && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
             V = {volume.toFixed(1)} L
          </div>
        )}

        {/* Pressure Warning Tint */}
        {processType === GasProcess.Isochoric && (
           <div 
             className="absolute inset-0 bg-red-500 pointer-events-none transition-opacity duration-300"
             style={{ opacity: (temperature - 200) / 1000 }}
           />
        )}
      </div>

      {/* Thermal Source */}
      <div className="h-16 w-full flex items-center justify-center mt-2 space-x-4">
          <div className={`transition-opacity duration-500 ${isHeating ? 'opacity-100' : 'opacity-0'}`}>
            <Flame className="w-10 h-10 text-orange-500 animate-pulse drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
          </div>
          
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase">Nguồn nhiệt</div>

          <div className={`transition-opacity duration-500 ${isCooling ? 'opacity-100' : 'opacity-0'}`}>
            <Snowflake className="w-10 h-10 text-cyan-500 animate-spin-slow drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
          </div>
      </div>
    </div>
  );
};

export default Cylinder;