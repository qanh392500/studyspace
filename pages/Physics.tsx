import React, { useState } from 'react';
import SimulationCanvas from './Physics/components/SimulationCanvas';
import ControlPanel from './Physics/components/ControlPanel';
import { SimulationConfig, MatterState } from './Physics/types';
import GeminiTutor from '../components/GeminiTutor';

const Physics: React.FC = () => {
  // Global Application State for Physics Simulation
  const [config, setConfig] = useState<SimulationConfig>({
    temperature: 100, // Start cold
    matterState: MatterState.SOLID,
    showPollen: false,
  });

  const handleConfigChange = (newConfig: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-950 flex flex-col p-4 md:p-6 font-sans transition-colors duration-300">
      
      {/* Header for Physics Section */}
      <div className="mb-6 flex justify-between items-center">
         <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Thuyết Động Học Phân Tử</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Quan sát sự thay đổi trạng thái của vật chất theo nhiệt độ</p>
         </div>
      </div>

      <div className="flex-grow w-full max-w-7xl mx-auto h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Left: Simulation Canvas (Takes more space) */}
        <div className="flex-grow relative bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
          <SimulationCanvas config={config} />
        </div>

        {/* Right: Controls (Fixed width on desktop) */}
        <div className="w-full md:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10 transition-colors">
          <ControlPanel config={config} onChange={handleConfigChange} />
        </div>

      </div>

      {/* AI Tutor */}
      <GeminiTutor />
    </div>
  );
};

export default Physics;