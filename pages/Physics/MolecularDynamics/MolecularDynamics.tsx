import React, { useState } from 'react';
import { PhysicsCanvas } from './components/PhysicsCanvas';
import { Histogram } from './components/Histogram';
import { FormulaDisplay } from './components/FormulaDisplay';
import { Activity, Thermometer, Wind, PlayCircle, PauseCircle } from 'lucide-react';

const MolecularDynamics: React.FC = () => {
  // State for Controls
  const [temperature, setTemperature] = useState<number>(30); // 10 to 100
  const [particleCount, setParticleCount] = useState<number>(100); // 50 to 200
  const [isSlowMotion, setIsSlowMotion] = useState<boolean>(false);

  // State for Real-time Stats
  const [simPressure, setSimPressure] = useState<number>(0);
  const [rmsSpeed, setRmsSpeed] = useState<number>(0);
  const [allSpeeds, setAllSpeeds] = useState<number[]>([]);

  const handleStatsUpdate = (p: number, v: number, speeds: number[]) => {
    setSimPressure(prev => prev * 0.7 + p * 0.3); // Simple smoothing
    setRmsSpeed(v);
    setAllSpeeds(speeds);
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Kính Hiển Vi Động Lực Học</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Nguồn gốc của áp suất & Định luật Maxwell-Boltzmann</p>
         </div>
         <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold border border-green-200 dark:border-green-800 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Khí Lý Tưởng
         </div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* Left Column: Canvas & Simulation */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-950 rounded-xl shadow-lg border border-slate-700 p-1">
             <PhysicsCanvas 
                temperature={temperature}
                particleCount={particleCount}
                isSlowMotion={isSlowMotion}
                onStatsUpdate={handleStatsUpdate}
             />
          </div>
          
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md">
             <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/50">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2 text-sm">
                    <Activity size={16} /> Phổ Tốc Độ (Maxwell-Boltzmann)
                </h3>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/30 px-2 py-1 rounded border border-cyan-900/50">
                    v_rms: {rmsSpeed.toFixed(1)} m/s
                </span>
             </div>
             <Histogram speeds={allSpeeds} maxSpeed={35} />
          </div>
        </div>

        {/* Right Column: Controls & Analysis */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                    <Wind size={64} />
                </div>
                <div className="flex items-center gap-2 text-slate-400 mb-2 relative z-10">
                    <Wind size={20} />
                    <span className="text-sm font-bold uppercase">Áp suất (p)</span>
                </div>
                <div className="text-3xl font-mono font-bold text-white tracking-tight relative z-10">
                    {(simPressure * 100).toFixed(0)} <span className="text-base text-slate-500 font-sans">Pa</span>
                </div>
                <div className="text-xs text-green-400 mt-1 relative z-10 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                    Realtime
                </div>
            </div>
            
            <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white">
                    <Thermometer size={64} />
                </div>
                <div className="flex items-center gap-2 text-slate-400 mb-2 relative z-10">
                    <Thermometer size={20} />
                    <span className="text-sm font-bold uppercase">Nhiệt độ (T)</span>
                </div>
                <div className="text-3xl font-mono font-bold text-white tracking-tight relative z-10">
                    {(temperature * 3 + 273).toFixed(0)} <span className="text-base text-slate-500 font-sans">K</span>
                </div>
                <div className="text-xs text-blue-400 mt-1 relative z-10">
                    ~ Động năng
                </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md transition-colors">
            <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Bảng Điều Khiển</h2>
            
            <div className="space-y-6">
                {/* Temperature Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Nhiệt độ (T)</label>
                        <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400 font-bold">{temperature}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="10" 
                        max="100" 
                        value={temperature} 
                        onChange={(e) => setTemperature(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-colors"
                    />
                    <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                        <span>Lạnh</span>
                        <span>Nóng</span>
                    </div>
                </div>

                {/* Particle Count Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Số lượng hạt (N)</label>
                        <span className="text-sm font-mono text-purple-600 dark:text-purple-400 font-bold">{particleCount}</span>
                    </div>
                    <input 
                        type="range" 
                        min="20" 
                        max="200" 
                        step="10"
                        value={particleCount} 
                        onChange={(e) => setParticleCount(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-colors"
                    />
                     <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                        <span>Thưa</span>
                        <span>Dày đặc</span>
                    </div>
                </div>

                {/* Slow Motion Toggle */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                        <label className="flex items-center gap-3 cursor-pointer group select-none">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={isSlowMotion} 
                                    onChange={(e) => setIsSlowMotion(e.target.checked)} 
                                />
                                <div className={`w-12 h-6 rounded-full transition-colors duration-300 ease-in-out ${isSlowMotion ? 'bg-red-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ease-in-out ${isSlowMotion ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                Chế độ Phân tích (Slow Motion)
                            </span>
                        </label>
                        {isSlowMotion ? <PauseCircle className="text-red-500 animate-pulse" /> : <PlayCircle className="text-slate-400" />}
                    </div>
                    
                    {isSlowMotion && (
                        <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="font-bold mb-1 flex items-center gap-1">🛑 ĐANG QUAY CHẬM</div>
                            Theo dõi hạt màu đỏ va chạm với thành bình bên phải để thấy vectơ động lượng và nguyên nhân gây ra áp suất.
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Dynamic Formulas */}
          <FormulaDisplay temperature={temperature} />

        </div>
      </div>
    </div>
  );
};

export default MolecularDynamics;