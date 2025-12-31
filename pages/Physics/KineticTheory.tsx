import React, { useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import { SimulationConfig, MatterState } from './types';

const KineticTheory: React.FC = () => {
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
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      {/* Header for Specific Simulation */}
      <div className="mb-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Thuyết Động Học Phân Tử</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Quan sát sự thay đổi trạng thái của vật chất theo nhiệt độ</p>
         </div>
      </div>

      <div className="flex-grow w-full max-w-7xl mx-auto min-h-[600px] h-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800 transition-colors">
        
        {/* Left: Simulation Canvas (Takes more space) */}
        <div className="flex-grow relative bg-slate-50 dark:bg-slate-950 p-4 transition-colors overflow-hidden">
          <SimulationCanvas config={config} />
        </div>

        {/* Right: Controls (Fixed width on desktop) */}
        <div className="w-full md:w-[350px] lg:w-[400px] flex-shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-10 transition-colors overflow-y-auto">
          <ControlPanel config={config} onChange={handleConfigChange} />
        </div>

      </div>
    </div>
  );
};

export default KineticTheory;