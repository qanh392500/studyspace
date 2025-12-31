import React, { useState, useEffect, useRef, useCallback } from 'react';
import MacroView from './components/MacroView';
import MicroView from './components/MicroView';
import GraphView from './components/GraphView';
import FormulaBoard from './components/FormulaBoard';
import SimulationControls from './components/SimulationControls';
import { calculateState } from './constants';
import { GraphPoint, SimulationState } from './types';

// Time Scale: 1 real second = X simulation seconds
const TIME_SCALE = 50; 

const HeatingCurve: React.FC = () => {
  // --- State ---
  const [isOn, setIsOn] = useState(false);
  const [power, setPower] = useState(1500); // Watts
  const [simulationTime, setSimulationTime] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [simState, setSimState] = useState<SimulationState>(calculateState(0));
  const [graphData, setGraphData] = useState<GraphPoint[]>([]);

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // --- Logic ---

  const reset = () => {
    setIsOn(false);
    setSimulationTime(0);
    setTotalEnergy(0);
    setSimState(calculateState(0));
    setGraphData([]);
  };

  const updateSimulation = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    // Delta time in milliseconds since last frame
    const dtMs = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isOn) {
      // Calculate simulation time step (in seconds)
      const dtSim = (dtMs / 1000) * TIME_SCALE;
      
      // Update Sim Time
      setSimulationTime(prev => prev + dtSim);

      setTotalEnergy(prevQ => {
        const addedQ = power * dtSim;
        const newQ = prevQ + addedQ;
        
        // Recalculate physics state
        const newState = calculateState(newQ);
        setSimState(newState);
        return newQ;
      });
    }
    
    requestRef.current = requestAnimationFrame(updateSimulation);
  }, [isOn, power]);

  // Handle Graph Data Throttling/Appending
  useEffect(() => {
    if (isOn) {
       // Only add point if time has moved significantly
       setGraphData(prev => {
         const lastPoint = prev[prev.length - 1];
         // Add point every 10 simulation seconds roughly (adjusted for performance)
         if (!lastPoint || (simulationTime - lastPoint.time) > 10) {
           return [...prev, { time: simulationTime, temperature: simState.temperature }];
         }
         return prev;
       });
    } else if (simulationTime === 0) {
        // Initial point
        if (graphData.length === 0) {
            setGraphData([{ time: 0, temperature: simState.temperature }]);
        }
    }
  }, [simulationTime, simState.temperature, isOn]);


  // Loop Controller
  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSimulation);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateSimulation]);


  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
       <div className="mb-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sự Chuyển Thể & Nhiệt Lượng</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Khảo sát quá trình nóng chảy và sôi của nước</p>
         </div>
      </div>

      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 transition-colors flex flex-col lg:flex-row lg:h-[calc(100vh-140px)] lg:overflow-hidden">
        
        {/* --- LEFT COLUMN: EXPERIMENT & MICRO --- */}
        {/* Mobile: content flows naturally. Desktop: fixed width, scrollable vertically */}
        <div className="lg:w-5/12 p-6 flex flex-col gap-6 bg-slate-50 dark:bg-slate-950 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 lg:overflow-y-auto custom-scrollbar shrink-0">
          
          {/* Visual Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden relative shrink-0">
             <div className="absolute top-2 left-2 z-20 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded">
               x{TIME_SCALE} Tốc độ
             </div>
             
             <div className="p-6 flex flex-col items-center space-y-8">
               {/* Micro View (Lens) */}
               <MicroView 
                 temperature={simState.temperature}
                 phase={simState.phase}
                 meltFraction={simState.meltFraction}
                 boilFraction={simState.boilFraction}
               />
               
               {/* Macro View (Beaker) */}
               <MacroView 
                  temperature={simState.temperature}
                  phase={simState.phase}
                  meltFraction={simState.meltFraction}
                  boilFraction={simState.boilFraction}
                  isOn={isOn}
                  power={power}
               />
             </div>
          </div>

          {/* Controls */}
          <SimulationControls 
            isOn={isOn}
            setIsOn={setIsOn}
            power={power}
            setPower={setPower}
            onReset={reset}
            time={simulationTime}
            energy={totalEnergy}
          />

        </div>

        {/* --- RIGHT COLUMN: GRAPH & MATH --- */}
        <div className="lg:w-7/12 p-6 flex flex-col gap-6 bg-white dark:bg-slate-900 lg:overflow-y-auto custom-scrollbar">
           {/* Graph */}
           <div className="shrink-0">
             <GraphView 
               data={graphData}
               currentTemp={simState.temperature}
               currentPhase={simState.phase}
             />
           </div>

           {/* Math Board */}
           <FormulaBoard 
             phase={simState.phase}
             temperature={simState.temperature}
           />

           {/* Educational Note */}
           <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-600 p-4 text-sm text-amber-800 dark:text-amber-200 rounded shrink-0">
              <strong className="block mb-1">Ghi chú giáo viên:</strong>
              Hãy quan sát kỹ giai đoạn <strong>Nóng chảy</strong> (0°C) và <strong>Sôi</strong> (100°C). 
              Mặc dù bếp vẫn cung cấp nhiệt (Q tăng), nhưng nhiệt độ (T) không thay đổi. 
              Năng lượng này gọi là <strong>Ẩn nhiệt (Latent Heat)</strong>, được dùng để phá vỡ liên kết phân tử thay vì làm tăng động năng trung bình.
           </div>
        </div>

      </div>
    </div>
  );
};

export default HeatingCurve;