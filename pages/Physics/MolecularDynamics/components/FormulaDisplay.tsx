import React from 'react';

interface FormulaDisplayProps {
  temperature: number;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ temperature }) => {
  const heatColor = `hsl(${Math.min((temperature / 100) * 360, 360)}, 80%, 60%)`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
      
      {/* Pressure Formula */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-slate-400 text-xs uppercase font-bold mb-2">Định Luật Cơ Bản Của Thuyết Động Học</h3>
        <div className="text-xl font-serif flex items-center justify-center space-x-2 text-slate-200">
            <span>p = </span>
            <div className="flex flex-col items-center mx-1">
                <span className="border-b border-slate-500 px-1">1</span>
                <span>3</span>
            </div>
            <span>μ m</span>
            <span 
                className="transition-all duration-300 font-bold border-b-2 border-transparent"
                style={{ color: heatColor, borderColor: heatColor }}
            >
                {`v\u0305`}<sup className="text-sm">2</sup>
            </span>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
            Áp suất tỉ lệ với bình phương vận tốc trung bình.
        </p>
      </div>

      {/* Kinetic Energy Formula */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-slate-400 text-xs uppercase font-bold mb-2">Động Năng Trung Bình</h3>
        <div className="text-xl font-serif flex items-center justify-center space-x-2 text-slate-200">
            <span style={{ color: heatColor }} className="transition-colors">{`E\u0305`}<sub className="text-sm">đ</sub></span>
            <span>=</span>
            <div className="flex flex-col items-center mx-1">
                <span className="border-b border-slate-500 px-1">3</span>
                <span>2</span>
            </div>
            <span>k</span>
            <span 
                className="transition-all duration-300 font-bold"
                style={{ color: heatColor, fontSize: `${1 + (temperature/200)}rem` }}
            >
                T
            </span>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
            Nhiệt độ là số đo động năng trung bình của phân tử.
        </p>
      </div>
    </div>
  );
};