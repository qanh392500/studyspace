import React from 'react';
import { Phase } from '../types';
import { Flame } from 'lucide-react';

interface MacroViewProps {
  temperature: number;
  phase: Phase;
  meltFraction: number;
  boilFraction: number;
  isOn: boolean;
  power: number;
}

const MacroView: React.FC<MacroViewProps> = ({ 
  temperature, 
  phase, 
  meltFraction, 
  boilFraction,
  isOn,
  power
}) => {
  
  // Calculate heights for visual representation
  const TOTAL_HEIGHT = 120;
  
  // Ice Height
  let iceHeight = 0;
  let waterHeight = 0;

  if (phase === Phase.SOLID) {
    iceHeight = TOTAL_HEIGHT;
  } else if (phase === Phase.MELTING) {
    iceHeight = TOTAL_HEIGHT * (1 - meltFraction);
    waterHeight = TOTAL_HEIGHT * meltFraction;
  } else if (phase === Phase.LIQUID) {
    waterHeight = TOTAL_HEIGHT;
  } else if (phase === Phase.BOILING) {
    waterHeight = TOTAL_HEIGHT * (1 - boilFraction);
  }

  // Heater Color (Visual feedback for Power)
  // Max power usually 2000W in slider, map 0-2000 to opacity
  const heaterOpacity = isOn ? (0.3 + (power / 2000) * 0.7) : 0.1;

  return (
    <div className="flex flex-col items-center justify-end h-64 relative">
        <h4 className="absolute top-0 font-bold text-slate-600 dark:text-slate-300">Thí nghiệm Vĩ mô</h4>

        {/* Thermometer (Simplified) */}
        <div className="absolute right-10 bottom-24 w-4 h-32 bg-gray-100 border border-gray-300 rounded-t-lg z-10 flex flex-col justify-end">
            <div 
                className="w-full bg-red-500 rounded-b-sm transition-all duration-300"
                style={{ height: `${Math.min(100, Math.max(0, (temperature + 20) / 1.4))}%` }}
            ></div>
            <div className="absolute -right-16 bottom-0 text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{temperature.toFixed(0)}°C</div>
        </div>

        {/* Beaker */}
        <div className="w-32 h-40 border-l-2 border-r-2 border-b-4 border-gray-400 dark:border-gray-500 rounded-b-lg relative overflow-hidden bg-white/50 dark:bg-white/10 backdrop-blur-sm">
            
            {/* Water Layer */}
            <div 
                className="absolute bottom-0 w-full bg-blue-400/60 dark:bg-blue-500/60 transition-all duration-100"
                style={{ height: `${waterHeight}px` }}
            >
                {/* Boiling bubbles */}
                {(phase === Phase.BOILING || (phase === Phase.LIQUID && temperature > 90)) && (
                    <div className="w-full h-full relative overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                             <div key={i} className="absolute bg-white/70 rounded-full w-2 h-2 animate-bounce" 
                                  style={{ 
                                      left: `${Math.random()*100}%`, 
                                      bottom: `${Math.random()*20}px`,
                                      animationDuration: `${0.5 + Math.random()}s`
                                  }} 
                             />
                        ))}
                    </div>
                )}
            </div>

            {/* Ice Layer (Floating Cubes representation) */}
            {iceHeight > 0 && (
                <div 
                    className="absolute bottom-0 w-full flex flex-wrap content-end justify-center gap-1 p-1 transition-all duration-100"
                    style={{ height: `${waterHeight + iceHeight}px` }} // Sit on top/mix
                >
                    {/* Render simplistic Ice Cubes */}
                    <div className="w-full h-full absolute top-0 left-0 bg-blue-200/50" style={{clipPath: 'polygon(0% 0%, 100% 10%, 100% 100%, 0% 100%)'}}></div>
                    {[...Array(Math.ceil(iceHeight / 20))].map((_, i) => (
                         <div key={i} className="w-6 h-6 bg-white/80 border border-blue-200 shadow-sm opacity-90 z-10 transform rotate-12" />
                    ))}
                </div>
            )}
             
            {/* Steam (Boiling) */}
            {phase === Phase.BOILING && (
                <div className="absolute top-0 w-full h-full flex justify-center opacity-50">
                     <div className="w-full h-20 bg-gradient-to-t from-transparent to-white/80 absolute -top-10 animate-pulse"></div>
                </div>
            )}
        </div>

        {/* Heater Plate */}
        <div className="w-40 h-4 bg-gray-700 rounded mt-1 relative overflow-hidden">
             {/* Heating Element Glow */}
             <div 
                className="absolute inset-0 bg-red-600 blur-sm transition-opacity duration-300"
                style={{ opacity: heaterOpacity }}
             ></div>
        </div>
        
        {/* Base */}
        <div className="w-48 h-8 bg-gray-800 rounded-b-lg flex items-center justify-center">
            {isOn && <Flame className="text-red-500 animate-pulse w-6 h-6" />}
            <span className="text-gray-400 text-xs ml-2 font-mono">{isOn ? `${power}W` : 'OFF'}</span>
        </div>
    </div>
  );
};

export default MacroView;