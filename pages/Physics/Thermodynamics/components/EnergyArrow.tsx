import React from 'react';

interface EnergyArrowProps {
  value: number;
  type: 'WORK' | 'HEAT';
  label: string;
  x: number;
  y: number;
  vertical?: boolean;
}

export const EnergyArrow: React.FC<EnergyArrowProps> = ({ value, type, label, x, y, vertical }) => {
  if (Math.abs(value) < 1) return null;

  const isPositive = value > 0;
  // A > 0 (Compression) -> Into system
  // Q > 0 (Heating) -> Into system
  // A < 0 (Expansion) -> Out of system
  // Q < 0 (Cooling) -> Out of system
  
  const color = type === 'WORK' ? 'fill-blue-600 dark:fill-blue-400' : 'fill-red-600 dark:fill-red-400';
  const textCol = type === 'WORK' ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300';
  
  // Direction logic
  // Vertical (Piston): Positive = Down (Into gas), Negative = Up (Out of gas)
  // Horizontal (Heat - simplified for visual): Positive = Up (Into gas), Negative = Down (Out of gas)
  
  let rotation = 0;
  if (vertical) {
    // Work
    rotation = isPositive ? 90 : -90; 
  } else {
    // Heat (visualized from bottom)
    rotation = isPositive ? -90 : 90;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <g transform={`rotate(${rotation})`}>
        <path 
          d="M -10 -20 L 10 -20 L 10 10 L 20 10 L 0 35 L -20 10 L -10 10 Z" 
          className={`${color} opacity-80 drop-shadow-md transition-all duration-300`}
        />
      </g>
      <foreignObject x={vertical ? 40 : -50} y={vertical ? -15 : 40} width="120" height="60">
        <div className={`font-bold text-xs ${textCol} bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded text-center border border-gray-200 dark:border-slate-600 shadow-sm`}>
          {label} {value > 0 ? '+' : ''}{Math.round(value)}J
          <div className="text-[10px] font-normal text-gray-600 dark:text-gray-400 mt-0.5">
             {isPositive ? (type === 'WORK' ? 'Nhận công' : 'Nhận nhiệt') : (type === 'WORK' ? 'Thực hiện công' : 'Truyền nhiệt')}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};