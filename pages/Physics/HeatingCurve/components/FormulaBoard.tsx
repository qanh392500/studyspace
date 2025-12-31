import React from 'react';
import { Phase } from '../types';

interface FormulaBoardProps {
  phase: Phase;
  temperature: number;
}

const FormulaBoard: React.FC<FormulaBoardProps> = ({ phase }) => {
  
  const getHighlightClass = (targetPhase: Phase) => {
    return phase === targetPhase 
      ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-600 dark:border-blue-400 p-3 rounded shadow-sm transition-all duration-300" 
      : "opacity-60 dark:opacity-40 p-3 border-l-4 border-transparent";
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors">
      <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-white">Phương Trình Vật Lý (1kg Nước)</h3>
      
      <div className="space-y-2 font-mono text-sm md:text-base">
        {/* Phase 1 */}
        <div className={getHighlightClass(Phase.SOLID)}>
          <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">1. Làm nóng chất rắn (-20°C → 0°C)</div>
          <div className="text-blue-800 dark:text-blue-300">Q = m · c<sub>đá</sub> · Δt</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Động năng phân tử tăng. Nhiệt độ tăng.</div>
        </div>

        {/* Phase 2 */}
        <div className={getHighlightClass(Phase.MELTING)}>
          <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">2. Nóng chảy (0°C) - <span className="text-red-600 dark:text-red-400">Ẩn nhiệt</span></div>
          <div className="text-blue-800 dark:text-blue-300">Q = λ · m</div>
          <div className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">Nhiệt độ KHÔNG đổi. Năng lượng dùng bẻ gãy liên kết tinh thể.</div>
        </div>

        {/* Phase 3 */}
        <div className={getHighlightClass(Phase.LIQUID)}>
          <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">3. Làm nóng chất lỏng (0°C → 100°C)</div>
          <div className="text-blue-800 dark:text-blue-300">Q = m · c<sub>nước</sub> · Δt</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Động năng phân tử tăng mạnh. Nhiệt độ tăng.</div>
        </div>

        {/* Phase 4 */}
        <div className={getHighlightClass(Phase.BOILING)}>
          <div className="font-bold text-slate-700 dark:text-slate-200 mb-1">4. Sôi / Hóa hơi (100°C)</div>
          <div className="text-blue-800 dark:text-blue-300">Q = L · m</div>
          <div className="text-xs text-red-500 dark:text-red-400 font-semibold mt-1">Nhiệt độ KHÔNG đổi. Phân tử bứt khỏi bề mặt.</div>
        </div>
      </div>
    </div>
  );
};

export default FormulaBoard;