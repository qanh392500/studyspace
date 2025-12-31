import React from 'react';
import { MatterState, SimulationConfig } from '../types';
import { Activity, Snowflake, Sun, Droplets, Wind } from 'lucide-react';

interface Props {
  config: SimulationConfig;
  onChange: (newConfig: Partial<SimulationConfig>) => void;
}

const ControlPanel: React.FC<Props> = ({ config, onChange }) => {
  
  const stateTranslations: Record<MatterState, string> = {
    [MatterState.SOLID]: 'RẮN',
    [MatterState.LIQUID]: 'LỎNG',
    [MatterState.GAS]: 'KHÍ'
  };

  const celsius = Math.round(config.temperature - 273);

  // Use brighter colors for better visibility
  const getTempColor = () => {
    if (config.temperature < 273) return 'text-blue-500 dark:text-blue-400';
    if (config.temperature < 373) return 'text-cyan-500 dark:text-cyan-400';
    return 'text-red-500 dark:text-red-400';
  };

  const setPreset = (state: MatterState) => {
    let temp = 0;
    switch (state) {
      case MatterState.SOLID: temp = 100; break;
      case MatterState.LIQUID: temp = 300; break;
      case MatterState.GAS: temp = 600; break;
    }
    onChange({ temperature: temp, matterState: state });
  };

  // Handle manual slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const temp = parseInt(e.target.value);
    let newState = config.matterState;

    // Auto-switch state based on physics thresholds (Educational Logic)
    if (temp < 273) newState = MatterState.SOLID;
    else if (temp < 373) newState = MatterState.LIQUID;
    else newState = MatterState.GAS;

    onChange({ temperature: temp, matterState: newState });
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-y-auto transition-colors">
      
      {/* Header */}
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Bảng Điều Khiển
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Mô phỏng Thuyết Động học Phân tử</p>
      </div>

      {/* Dashboard Display - High Contrast */}
      <div className="bg-slate-900 dark:bg-black/40 rounded-lg p-6 text-center shadow-inner relative border border-slate-800 dark:border-slate-700">
        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Nhiệt độ</span>
        
        {/* BIG CELSIUS */}
        <div className={`text-5xl font-mono font-bold mt-2 min-h-[3.5rem] ${getTempColor()} transition-colors duration-300 drop-shadow-md`}>
          {celsius} <span className="text-3xl text-slate-300">°C</span>
        </div>
        
        {/* SMALL KELVIN */}
        <div className="text-slate-500 font-mono mt-1 text-sm">
          ({config.temperature} K)
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center px-4">
            <span className="text-slate-400 text-xs uppercase">Trạng thái</span>
            <span className="text-white font-bold tracking-wide text-lg">{stateTranslations[config.matterState]}</span>
        </div>
      </div>

      {/* Temperature Slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-blue-400" />
                Chỉnh Nhiệt độ
                <Sun className="w-4 h-4 text-red-400" />
            </label>
        </div>
        
        <div className="relative pt-2 pb-6">
            <input
              type="range"
              min="0"
              max="1000"
              step="1"
              value={config.temperature}
              onChange={handleSliderChange}
              className="relative z-20 w-full h-3 bg-gradient-to-r from-blue-500 via-cyan-400 to-red-500 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-400 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 font-mono mt-2 px-1">
              <span>0K</span>
              <span>1000K</span>
            </div>
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Chọn Nhanh</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPreset(MatterState.SOLID)}
            className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${config.matterState === MatterState.SOLID ? 'bg-indigo-100 dark:bg-indigo-900/40 border-2 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            <div className="w-8 h-8 rounded bg-blue-600 grid grid-cols-2 gap-0.5 p-1 opacity-80 shadow-sm">
                <div className="bg-white rounded-full"></div><div className="bg-white rounded-full"></div>
                <div className="bg-white rounded-full"></div><div className="bg-white rounded-full"></div>
            </div>
            <span className="text-xs font-bold">Rắn</span>
          </button>

          <button
            onClick={() => setPreset(MatterState.LIQUID)}
            className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${config.matterState === MatterState.LIQUID ? 'bg-cyan-100 dark:bg-cyan-900/40 border-2 border-cyan-500 text-cyan-700 dark:text-cyan-300' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            <Droplets className="w-6 h-6" />
            <span className="text-xs font-bold">Lỏng</span>
          </button>

          <button
            onClick={() => setPreset(MatterState.GAS)}
            className={`p-3 rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${config.matterState === MatterState.GAS ? 'bg-red-100 dark:bg-red-900/40 border-2 border-red-500 text-red-700 dark:text-red-300' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
          >
            <Wind className="w-6 h-6" />
            <span className="text-xs font-bold">Khí</span>
          </button>
        </div>
      </div>

      {/* Experiments */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Thí nghiệm</span>
        
        <label className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer group transition-colors">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-sm flex items-center justify-center">
                    <span className="block w-1 h-1 bg-yellow-700 rounded-full"></span>
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Chuyển động Brown</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Thả hạt phấn hoa</span>
                </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors relative ${config.showPollen ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${config.showPollen ? 'translate-x-6' : ''}`}></div>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={config.showPollen}
                    onChange={(e) => onChange({ showPollen: e.target.checked })}
                />
            </div>
        </label>
      </div>

      {/* Educational Note */}
      <div className="mt-auto bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
        <strong>Ghi chú Giáo viên:</strong> 
        <ul className="list-disc pl-4 mt-1 space-y-1 opacity-90">
            <li><strong>Rắn:</strong> Phân tử rung động trong mạng lưới. Động năng thấp.</li>
            <li><strong>Lỏng:</strong> Phân tử trượt lên nhau. Trọng lực ảnh hưởng hình dạng khối chất lỏng.</li>
            <li><strong>Khí:</strong> Chuyển động tự do hỗn loạn. Va chạm tạo áp suất. Động năng cao.</li>
        </ul>
      </div>

    </div>
  );
};

export default ControlPanel;