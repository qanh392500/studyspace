import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface ControlsProps {
  isOn: boolean;
  setIsOn: (val: boolean) => void;
  power: number;
  setPower: (val: number) => void;
  onReset: () => void;
  time: number;
  energy: number;
}

const SimulationControls: React.FC<ControlsProps> = ({ 
  isOn, setIsOn, power, setPower, onReset, time, energy 
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 w-full space-y-4 transition-colors">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-700 dark:text-slate-200">Bảng Điều Khiển</h3>
        <button 
          onClick={onReset}
          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors p-1"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      {/* Main Switch */}
      <div className="flex items-center space-x-4">
         <button
            onClick={() => setIsOn(!isOn)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-lg font-bold transition-all shadow-sm ${
                isOn 
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-500 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50' 
                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-500 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
            }`}
         >
            {isOn ? <><Pause size={20} /> <span>TẮT BẾP</span></> : <><Play size={20} /> <span>BẬT BẾP</span></>}
         </button>
      </div>

      {/* Power Slider */}
      <div>
        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase flex justify-between">
          <span>Công Suất Bếp (P)</span>
          <span className="text-slate-900 dark:text-white font-mono">{power} W</span>
        </label>
        <div className="relative pt-1">
            <input 
            type="range" 
            min="500" 
            max="3000" 
            step="100" 
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            disabled={isOn} // Disable changing power while running
            className={`w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer ${isOn ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">
            *Điều chỉnh công suất khi bếp tắt
        </div>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Thời gian (t)</div>
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400 text-lg">{time.toFixed(0)} s</div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Nhiệt lượng (Q)</div>
            <div className="font-mono font-bold text-orange-600 dark:text-orange-400 text-lg">{(energy / 1000).toFixed(1)} kJ</div>
        </div>
      </div>
    </div>
  );
};

export default SimulationControls;