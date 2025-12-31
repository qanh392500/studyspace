import React, { useState } from 'react';
import { GasProcess, GasState } from './types';
import { PROCESS_CONFIG, MOLES, IDEAL_GAS_CONSTANT, MAX_PRESSURE_WARNING, MIN_VOL, MAX_VOL, MIN_TEMP, MAX_TEMP } from './constants';
import Cylinder from './components/Cylinder';
import Graph from './components/Graph';
import { AlertTriangle, Info, RefreshCw, ThermometerSun, MoveDiagonal, Maximize } from 'lucide-react';

const GasLaws: React.FC = () => {
  // --- State ---
  const [mode, setMode] = useState<GasProcess>(GasProcess.Isothermal);
  
  // Physics State
  const [volume, setVolume] = useState<number>(30); // Liters
  const [temperature, setTemperature] = useState<number>(300); // Kelvin
  
  // Initial State (Snapshot when mode changes)
  const [initialState, setInitialState] = useState<GasState>({
    pressure: (MOLES * IDEAL_GAS_CONSTANT * 300) / 30,
    volume: 30,
    temperature: 300
  });

  // Visual cues
  const [isHeating, setIsHeating] = useState(false);
  const [isCooling, setIsCooling] = useState(false);

  // --- Derived Values ---
  const pressure = (MOLES * IDEAL_GAS_CONSTANT * temperature) / volume;
  const isDangerous = pressure > MAX_PRESSURE_WARNING;

  // --- Handlers ---

  const handleModeChange = (newMode: GasProcess) => {
    // Snapshot current state as the new "Initial" state for comparison
    setInitialState({
      pressure,
      volume,
      temperature
    });
    setMode(newMode);
  };

  const handleVolumeChange = (newVol: number) => {
    if (mode === GasProcess.Isothermal) {
      setVolume(newVol);
      // T is constant
    } else {
      // In other modes, direct V manipulation isn't the primary control.
    }
  };

  const handleTemperatureChange = (newTemp: number) => {
    // Determine visual heating/cooling
    if (newTemp > temperature) {
      setIsHeating(true);
      setIsCooling(false);
    } else if (newTemp < temperature) {
      setIsHeating(false);
      setIsCooling(true);
    }
    
    // Clear visual cue after transition
    setTimeout(() => {
      setIsHeating(false);
      setIsCooling(false);
    }, 500);

    if (mode === GasProcess.Isobaric) {
      setTemperature(newTemp);
      const constantP = initialState.pressure;
      // V = nRT / P
      let newV = (MOLES * IDEAL_GAS_CONSTANT * newTemp) / constantP;
      
      // Clamp V
      if (newV > MAX_VOL) newV = MAX_VOL;
      if (newV < MIN_VOL) newV = MIN_VOL;
      
      setVolume(newV);
    }
    else if (mode === GasProcess.Isochoric) {
      setTemperature(newTemp);
      // V is constant, so just update T. P will auto-update via derived variable.
    }
  };

  // --- Calculation Display ---
  const renderVerificationMath = () => {
    const p1 = initialState.pressure.toFixed(2);
    const v1 = initialState.volume.toFixed(1);
    const t1 = initialState.temperature.toFixed(0);
    
    const p2 = pressure.toFixed(2);
    const v2 = volume.toFixed(1);
    const t2 = temperature.toFixed(0);

    if (mode === GasProcess.Isothermal) {
      // P1*V1 = P2*V2
      return (
        <div className="flex flex-col space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 mt-2">
          <div className="flex justify-between">
            <span>p₁V₁ = {p1} × {v1} = <b>{(initialState.pressure * initialState.volume).toFixed(1)}</b></span>
          </div>
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>p₂V₂ = {p2} × {v2} = <b>{(pressure * volume).toFixed(1)}</b></span>
          </div>
        </div>
      );
    }
    if (mode === GasProcess.Isobaric) {
      // V1/T1 = V2/T2
      return (
        <div className="flex flex-col space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 mt-2">
           <div className="flex justify-between">
            <span>V₁/T₁ = {v1}/{t1} = <b>{(initialState.volume / initialState.temperature).toFixed(4)}</b></span>
          </div>
          <div className="flex justify-between text-orange-600 dark:text-orange-400">
            <span>V₂/T₂ = {v2}/{t2} = <b>{(volume / temperature).toFixed(4)}</b></span>
          </div>
        </div>
      );
    }
    if (mode === GasProcess.Isochoric) {
       // P1/T1 = P2/T2
       return (
        <div className="flex flex-col space-y-1 text-xs font-mono text-slate-500 dark:text-slate-400 mt-2">
           <div className="flex justify-between">
            <span>p₁/T₁ = {p1}/{t1} = <b>{(initialState.pressure / initialState.temperature).toFixed(4)}</b></span>
          </div>
          <div className="flex justify-between text-red-600 dark:text-red-400">
            <span>p₂/T₂ = {p2}/{t2} = <b>{(pressure / temperature).toFixed(4)}</b></span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto">
      <div className="mb-4 flex justify-between items-center shrink-0">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Định Luật Chất Khí</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mô phỏng 3 đẳng quá trình: Đẳng nhiệt, Đẳng tích, Đẳng áp</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* Left Column: Experiment Area */}
        <div className="lg:col-span-5 flex flex-col h-[600px] bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-700 relative select-none transition-colors">
          <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg backdrop-blur-md border border-slate-200 dark:border-slate-600">
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300">Buồng Thí Nghiệm</h2>
          </div>
          
          <div className="flex-1 mt-8">
            <Cylinder 
              volume={volume} 
              temperature={temperature} 
              processType={mode}
              isHeating={isHeating}
              isCooling={isCooling}
              onVolumeChange={handleVolumeChange}
            />
          </div>

          {/* Interactive Slider inside Cylinder area for direct feel */}
          <div className="mt-4 px-4 h-12">
            {mode === GasProcess.Isothermal && (
              <div className="flex items-center space-x-3">
                 <span className="text-xs font-bold w-16 text-right text-slate-600 dark:text-slate-300">Thể tích</span>
                 <input 
                   type="range" 
                   min={MIN_VOL} max={MAX_VOL} step={1}
                   value={volume}
                   onChange={(e) => handleVolumeChange(Number(e.target.value))}
                   className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-green-500"
                 />
                 <span className="text-xs font-mono w-12 text-slate-600 dark:text-slate-300">{volume.toFixed(0)}L</span>
              </div>
            )}
             {mode !== GasProcess.Isothermal && (
               <div className="flex items-center justify-center text-xs text-slate-400 italic h-full">
                 (Điều khiển Nhiệt độ ở bảng bên phải)
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Controls & Data */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          {/* Mode Selection */}
          <div className="grid grid-cols-3 gap-2">
            {Object.values(GasProcess).map((proc) => {
              const Icon = proc === GasProcess.Isothermal ? MoveDiagonal : proc === GasProcess.Isobaric ? Maximize : ThermometerSun;
              return (
                <button
                  key={proc}
                  onClick={() => handleModeChange(proc)}
                  className={`p-3 rounded-lg text-sm font-semibold transition-all duration-200 border flex flex-col items-center gap-2 ${
                    mode === proc 
                      ? `${PROCESS_CONFIG[proc].bgAccent} text-white border-transparent shadow-lg scale-105` 
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  {PROCESS_CONFIG[proc].name}
                </button>
              )
            })}
          </div>

          {/* Warning Banner */}
          {isDangerous && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 p-3 rounded-lg flex items-center space-x-3 animate-pulse">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <span className="text-red-600 dark:text-red-200 text-sm font-bold">CẢNH BÁO: Áp suất quá cao! Có nguy cơ nổ bình.</span>
            </div>
          )}

          {/* Main Display Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Parameters Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-md transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" /> Thông số
                </h3>
                <span className={`text-xs px-2 py-1 rounded font-bold ${PROCESS_CONFIG[mode].color} border ${PROCESS_CONFIG[mode].borderColor} bg-opacity-10 bg-current`}>
                  {PROCESS_CONFIG[mode].description}
                </span>
              </div>

              {/* Big Data Display */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="text-slate-500 text-xs uppercase mb-1">Áp suất (p)</div>
                  <div className={`text-lg lg:text-xl font-mono font-bold ${isDangerous ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {pressure.toFixed(2)}
                    <span className="text-xs text-slate-500 ml-1">atm</span>
                  </div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="text-slate-500 text-xs uppercase mb-1">Thể tích (V)</div>
                  <div className="text-lg lg:text-xl font-mono font-bold text-slate-800 dark:text-slate-200">
                    {volume.toFixed(1)}
                    <span className="text-xs text-slate-500 ml-1">L</span>
                  </div>
                </div>
                <div className="text-center p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                  <div className="text-slate-500 text-xs uppercase mb-1">Nhiệt độ (T)</div>
                  <div className="text-lg lg:text-xl font-mono font-bold text-slate-800 dark:text-slate-200">
                    {temperature.toFixed(0)}
                    <span className="text-xs text-slate-500 ml-1">K</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Slider based on Mode */}
              <div className="space-y-2">
                 <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                   {mode === GasProcess.Isothermal ? (
                     <>
                        <span>Nén (V giảm)</span>
                        <span>Giãn (V tăng)</span>
                     </>
                   ) : (
                     <>
                        <span>Nguồn Nhiệt (Lạnh)</span>
                        <span>Tăng nhiệt (Nóng)</span>
                     </>
                   )}
                 </div>
                 
                 {mode === GasProcess.Isothermal ? (
                   <input 
                      type="range" 
                      min={MIN_VOL} max={MAX_VOL} step={1}
                      value={volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300"
                    />
                 ) : (
                   <input 
                      type="range" 
                      min={MIN_TEMP} max={MAX_TEMP} step={5}
                      value={temperature}
                      onChange={(e) => handleTemperatureChange(Number(e.target.value))}
                      className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-blue-500 via-slate-400 to-orange-500"
                    />
                 )}
                 
                 <div className="text-center text-xs font-mono text-slate-500 dark:text-slate-300">
                   {mode === GasProcess.Isothermal ? "Điều chỉnh Thể tích (V)" : "Điều chỉnh Nhiệt độ (T)"}
                 </div>
              </div>

              {/* Verification Box */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-2">
                   <RefreshCw className="w-3 h-3" /> Kiểm chứng định luật
                 </div>
                 {renderVerificationMath()}
              </div>

            </div>

            {/* Graph Panel */}
            <div className="flex flex-col">
               <Graph processType={mode} currentState={{pressure, volume, temperature}} />
               <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
                 <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Giải thích hiện tượng</h4>
                 <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                   {mode === GasProcess.Isothermal && "Khi nhiệt độ không đổi, nếu nén khí (giảm V), mật độ phân tử tăng làm số lần va chạm lên thành bình tăng, dẫn đến áp suất tăng."}
                   {mode === GasProcess.Isobaric && "Khi áp suất không đổi, nếu nung nóng (tăng T), các phân tử chuyển động nhanh hơn. Để giữ áp suất như cũ, thể tích bình phải giãn nở ra."}
                   {mode === GasProcess.Isochoric && "Khi thể tích không đổi, nếu nung nóng (tăng T), các phân tử chuyển động nhanh và va đập mạnh hơn vào thành bình, làm áp suất tăng vọt."}
                 </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GasLaws;