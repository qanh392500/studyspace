import React, { useRef, useEffect } from 'react';
import { Particle, HeatSourceType, CONSTANTS } from '../types';
import { EnergyArrow } from './EnergyArrow';

interface CylinderSystemProps {
  height: number;
  particles: Particle[];
  temperature: number;
  heatSource: HeatSourceType;
  workDone: number;
  heatExchange: number;
  onPistonDrag: (deltaY: number) => void;
  onDragEnd: () => void;
}

export const CylinderSystem: React.FC<CylinderSystemProps> = ({
  height,
  particles,
  temperature,
  heatSource,
  workDone,
  heatExchange,
  onPistonDrag,
  onDragEnd,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);
  const lastY = useRef(0);

  // Adjusted dimensions to fix layout issues
  const cylinderHeight = 250;
  const cylinderWidth = CONSTANTS.CYLINDER_WIDTH;
  const wallThickness = 10;
  
  // Coordinate system: (0,0) is top-left of SVG. 
  // Increased bottomY to 350 to allow room at the top.
  const bottomY = 350;
  const pistonY = bottomY - height;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaY = e.clientY - lastY.current;
      lastY.current = e.clientY;
      onPistonDrag(deltaY);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        onDragEnd();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onPistonDrag, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastY.current = e.clientY;
  };

  // Color mapping for particles based on Temp
  const getParticleColor = (temp: number) => {
    if (temp < 300) return '#3b82f6'; // Blue
    if (temp > 600) return '#ef4444'; // Red
    return '#a855f7'; // Purple/Mixed
  };

  const particleColor = getParticleColor(temperature);

  return (
    <div className="relative flex flex-col items-center select-none w-full h-full justify-center">
      <svg 
        ref={svgRef} 
        width={cylinderWidth + 150} 
        height={500} 
        className="overflow-visible"
        style={{ touchAction: 'none' }} // Prevent scrolling on touch
      >
        {/* Definition for fire gradient */}
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="iceGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* System Container Group centered - Shifted to accommodate wider width */}
        <g transform={`translate(75, 0)`}>
          
          {/* Heat/Cold Source Visualization */}
          {heatSource === 'fire' && (
            <path d={`M 20 ${bottomY + 10} Q ${cylinderWidth/2} ${bottomY - 40} ${cylinderWidth - 20} ${bottomY + 10} Z`} fill="url(#fireGradient)" className="animate-pulse" />
          )}
          {heatSource === 'ice' && (
             <rect x="0" y={bottomY + 5} width={cylinderWidth} height="30" fill="url(#iceGradient)" />
          )}

          {/* Cylinder Walls */}
          <path 
            d={`M 0 50 L 0 ${bottomY} L ${cylinderWidth} ${bottomY} L ${cylinderWidth} 50`} 
            fill="none" 
            className="stroke-gray-600 dark:stroke-gray-400"
            strokeWidth={wallThickness} 
            strokeLinecap="round"
          />

          {/* Gas Area Background */}
          <rect 
            x={wallThickness/2} 
            y={pistonY} 
            width={cylinderWidth - wallThickness} 
            height={height} 
            fill={particleColor} 
            fillOpacity="0.1" 
          />

          {/* Particles */}
          {particles.map((p) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={bottomY - p.y} // Invert Y for drawing: 0 is bottom in physics model
              r={4}
              fill={particleColor}
            />
          ))}

          {/* Piston Head */}
          <g 
            transform={`translate(0, ${pistonY - 20})`} 
            onMouseDown={handleMouseDown}
            className="cursor-ns-resize hover:opacity-90 transition-opacity"
          >
            {/* Piston Body */}
            <rect x="5" y="0" width={cylinderWidth - 10} height="20" className="fill-gray-400 dark:fill-gray-500 stroke-gray-600 dark:stroke-gray-400" strokeWidth="2" />
            {/* Piston Rod */}
            <rect x={cylinderWidth/2 - 10} y="-100" width="20" height="100" className="fill-gray-300 dark:fill-gray-600 stroke-gray-400 dark:stroke-gray-500" />
            {/* Handle */}
            <rect x={cylinderWidth/2 - 40} y="-100" width="80" height="10" className="fill-gray-600 dark:fill-gray-400" rx="5" />
          </g>

          {/* Work Arrow (A) */}
          <EnergyArrow 
            value={workDone} 
            type="WORK" 
            label="A =" 
            x={cylinderWidth / 2} 
            y={pistonY - 40} 
            vertical={true}
          />

          {/* Heat Arrow (Q) */}
          <EnergyArrow 
            value={heatExchange} 
            type="HEAT" 
            label="Q =" 
            x={cylinderWidth / 2} 
            y={bottomY + 50} 
            vertical={false}
          />

        </g>
      </svg>
      
      <div className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-semibold">
        Kéo tay cầm pít-tông để thực hiện công
      </div>
    </div>
  );
};