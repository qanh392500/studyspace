import React from 'react';
import { HeatSourceType } from '../types';

interface DashboardProps {
  temperature: number;
  pressure: number;
  volume: number;
  deltaU: number;
  workDone: number;
  heatExchange: number;
  heatSource: HeatSourceType;
  onSetHeatSource: (source: HeatSourceType) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  temperature,
  pressure,
  volume,
  deltaU,
  workDone,
  heatExchange,
  heatSource,
  onSetHeatSource,
  onReset,
}) => {
  // Helpers for visual bars
  const tempPercent = Math.min(100, Math.max(0, (temperature / 1500) * 100)); // Scaled to max 1500
  const pressurePercent = Math.min(100, Math.max(0, (pressure / 300) * 100));
  
  // Dynamic formula coloring (with dark mode checks)
  const uColor = deltaU > 0 ? 'text-red-600 dark:text-red-400' : deltaU < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200';
  const aColor = workDone > 0 ? 'text-blue-600 dark:text-blue-400' : workDone < 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400';
  const qColor = heatExchange > 0 ? 'text-red-600 dark:text-red-400' : heatExchange < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 h-full flex flex-col gap-6 transition-colors">
      
      {/* Header */}
      <div className="border-b border-gray-100 dark:border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bảng Phân Tích</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Định luật I Nhiệt động lực học</p>
      </div>

      {/* Formula Display */}
      <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-lg text-center border border-gray-200 dark:border-slate-700 shadow-inner">
        <div className="text-4xl font-mono font-bold tracking-wider mb-2 flex justify-center gap-2 items-center flex-wrap">
            <span className={uColor}>ΔU</span> 
            <span className="text-gray-400">=</span> 
            <span className={aColor}>A</span> 
            <span className="text-gray-400">+</span> 
            <span className={qColor}>Q</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 px-4">
            <div className="text-center w-1/3">
                Biến thiên<br/>Nội năng
            </div>
            <div className="text-center w-1/3">
                Công cơ học<br/>(Nén/Giãn)
            </div>
            <div className="text-center w-1/3">
                Nhiệt lượng<br/>(Truyền vào)
            </div>
        </div>
        
        {/* Realtime Values */}
        <div className="flex justify-center gap-4 mt-4 font-mono text-sm items-center">
             <div className={`bg-white dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-700 shadow-sm w-24 text-center font-bold ${uColor}`}>
                {deltaU > 0 ? '+' : ''}{Math.round(deltaU)} J
             </div>
             <div className="px-1 text-gray-400">=</div>
             <div className={`bg-white dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-700 shadow-sm w-24 text-center font-bold ${aColor}`}>
                {workDone > 0 ? '+' : ''}{Math.round(workDone)} J
             </div>
             <div className="px-1 text-gray-400">+</div>
             <div className={`bg-white dark:bg-slate-900 px-2 py-1 rounded border dark:border-slate-700 shadow-sm w-24 text-center font-bold ${qColor}`}>
                {heatExchange > 0 ? '+' : ''}{Math.round(heatExchange)} J
             </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wide">Điều khiển Nhiệt (Q)</h3>
        <div className="flex gap-2">
            <button 
                onClick={() => onSetHeatSource('fire')}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${heatSource === 'fire' ? 'bg-red-500 text-white ring-2 ring-red-300 dark:ring-red-900 shadow-lg scale-105' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40'}`}
            >
                🔥 Cấp nhiệt
            </button>
            <button 
                onClick={() => onSetHeatSource('none')}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${heatSource === 'none' ? 'bg-gray-600 text-white ring-2 ring-gray-300 dark:ring-gray-700 shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
            >
                ⏹️ Cách nhiệt
            </button>
            <button 
                onClick={() => onSetHeatSource('ice')}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${heatSource === 'ice' ? 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-900 shadow-lg scale-105' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40'}`}
            >
                ❄️ Làm lạnh
            </button>
        </div>
      </div>

      {/* Gauges / State */}
      <div className="space-y-4 flex-grow">
        <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wide">Thông số Trạng thái</h3>
        
        {/* Temperature */}
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Nhiệt độ (T)</span>
                <span className="font-mono text-gray-900 dark:text-white">{Math.round(temperature)} K</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 via-orange-400 to-red-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${tempPercent}%` }}></div>
            </div>
        </div>

        {/* Pressure */}
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Áp suất (P)</span>
                <span className="font-mono text-gray-900 dark:text-white">{pressure.toFixed(1)} atm</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gray-800 dark:bg-gray-200 h-2.5 rounded-full transition-all duration-300" style={{ width: `${pressurePercent}%` }}></div>
            </div>
        </div>

        {/* Volume */}
        <div>
            <div className="flex justify-between mb-1">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Thể tích (V)</span>
                <span className="font-mono text-gray-900 dark:text-white">{Math.round(volume)} L</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(volume / 180) * 100}%` }}></div>
            </div>
        </div>
      </div>

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className="w-full py-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition-colors text-sm"
      >
        🔄 Đặt lại trạng thái ban đầu
      </button>

    </div>
  );
};