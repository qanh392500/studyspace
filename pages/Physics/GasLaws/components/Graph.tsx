import React, { useMemo } from 'react';
import { GasProcess, GasState } from '../types';
import { MAX_TEMP, MAX_VOL, PROCESS_CONFIG, MOLES, IDEAL_GAS_CONSTANT, MIN_VOL } from '../constants';

interface GraphProps {
  processType: GasProcess;
  currentState: GasState;
}

const Graph: React.FC<GraphProps> = ({ processType, currentState }) => {
  const width = 300;
  const height = 200;
  const padding = 30;

  // Derived Scales
  const maxP = 4.0; // Assume max pressure approx 4 atm for plotting

  // Generate Curve Data
  const pathData = useMemo(() => {
    let d = "";
    
    // Scale functions
    const scaleX = (val: number, max: number) => padding + (val / max) * (width - 2 * padding);
    const scaleY = (val: number, max: number) => height - padding - (val / max) * (height - 2 * padding);

    if (processType === GasProcess.Isothermal) {
      // P vs V (Hyperbola)
      const constantT = currentState.temperature;
      const points: [number, number][] = [];
      for (let v = MIN_VOL; v <= MAX_VOL; v += 2) {
        const p = (MOLES * IDEAL_GAS_CONSTANT * constantT) / v;
        if (p <= maxP) {
           points.push([scaleX(v, MAX_VOL), scaleY(p, maxP)]);
        }
      }
      if (points.length > 0) {
        d = `M ${points[0][0]} ${points[0][1]} ` + points.map(p => `L ${p[0]} ${p[1]}`).join(" ");
      }
    } 
    else if (processType === GasProcess.Isobaric) {
      // V vs T (Linear)
      const constantP = currentState.pressure;
      const k = (MOLES * IDEAL_GAS_CONSTANT) / constantP;
      
      const startT = 0;
      const endT = MAX_TEMP;
      const startV = k * startT;
      const endV = k * endT;

      d = `M ${scaleX(startT, MAX_TEMP)} ${scaleY(startV, MAX_VOL)} L ${scaleX(endT, MAX_TEMP)} ${scaleY(endV, MAX_VOL)}`;
    }
    else if (processType === GasProcess.Isochoric) {
      // P vs T (Linear)
      const constantV = currentState.volume;
      const k = (MOLES * IDEAL_GAS_CONSTANT) / constantV;
      
      const startT = 0;
      const endT = MAX_TEMP;
      const startP = k * startT;
      const endP = k * endT;

      d = `M ${scaleX(startT, MAX_TEMP)} ${scaleY(startP, maxP)} L ${scaleX(endT, MAX_TEMP)} ${scaleY(endP, maxP)}`;
    }

    return d;
  }, [processType, currentState.temperature, currentState.pressure, currentState.volume]);

  // Current Point Coordinates
  const getPoint = () => {
     const scaleX = (val: number, max: number) => padding + (val / max) * (width - 2 * padding);
     const scaleY = (val: number, max: number) => height - padding - (val / max) * (height - 2 * padding);

     if (processType === GasProcess.Isothermal) {
       // x: V, y: P
       return { cx: scaleX(currentState.volume, MAX_VOL), cy: scaleY(currentState.pressure, maxP) };
     }
     if (processType === GasProcess.Isobaric) {
       // x: T, y: V
       return { cx: scaleX(currentState.temperature, MAX_TEMP), cy: scaleY(currentState.volume, MAX_VOL) };
     }
     // Isochoric: x: T, y: P
     return { cx: scaleX(currentState.temperature, MAX_TEMP), cy: scaleY(currentState.pressure, maxP) };
  };

  const currentPoint = getPoint();
  // Using Tailwind colors directly but mapped to SVG classes via simple replacement string manipulation logic in constants won't work perfectly for stroke/fill in React without full classes.
  // We will map based on ProcessType manually here for simplicity and safety.
  
  let strokeColor = "#22c55e";
  let fillColor = "#22c55e";
  
  if (processType === GasProcess.Isobaric) { strokeColor = "#f97316"; fillColor = "#f97316"; }
  if (processType === GasProcess.Isochoric) { strokeColor = "#ef4444"; fillColor = "#ef4444"; }

  // Axis Labels
  let xLabel = "V (Lít)";
  let yLabel = "p (atm)";
  if (processType === GasProcess.Isobaric) { xLabel = "T (K)"; yLabel = "V (Lít)"; }
  if (processType === GasProcess.Isochoric) { xLabel = "T (K)"; yLabel = "p (atm)"; }

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-200 dark:border-slate-700">
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-2 uppercase tracking-wide">Đồ thị thời gian thực</h3>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#94a3b8" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={padding} y2={padding} stroke="#94a3b8" strokeWidth="2" />
        
        {/* Labels */}
        <text x={width - padding} y={height - padding + 20} textAnchor="end" fill="#94a3b8" fontSize="10">{xLabel}</text>
        <text x={padding} y={padding - 10} textAnchor="middle" fill="#94a3b8" fontSize="10">{yLabel}</text>

        {/* The Curve */}
        <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="2" strokeDasharray={processType === GasProcess.Isothermal ? "0" : "5,5"} />

        {/* Current Point */}
        <circle cx={currentPoint.cx} cy={currentPoint.cy} r="6" fill={fillColor} stroke="white" strokeWidth="2" />
        
        {/* Helper Lines */}
        <line x1={currentPoint.cx} y1={currentPoint.cy} x2={currentPoint.cx} y2={height - padding} stroke="#94a3b8" strokeDasharray="2,2" opacity="0.5" />
        <line x1={currentPoint.cx} y1={currentPoint.cy} x2={padding} y2={currentPoint.cy} stroke="#94a3b8" strokeDasharray="2,2" opacity="0.5" />

      </svg>
    </div>
  );
};

export default Graph;