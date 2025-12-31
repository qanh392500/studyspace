import React, { useMemo } from 'react';

interface HistogramProps {
  speeds: number[];
  maxSpeed: number;
}

export const Histogram: React.FC<HistogramProps> = ({ speeds, maxSpeed }) => {
  const bins = 30;
  const range = maxSpeed;

  const { counts, maxCount, rms, mpIndex } = useMemo(() => {
    const c = new Array(bins).fill(0);
    let sumSq = 0;
    
    speeds.forEach(v => {
      sumSq += v * v;
      const rawIdx = Math.floor((v / range) * bins);
      const idx = Math.min(rawIdx, bins - 1); 
      if (idx >= 0) c[idx]++;
    });
    
    const rmsVal = Math.sqrt(sumSq / (speeds.length || 1));
    const maxVal = Math.max(...c, 1);
    const mpIdx = c.indexOf(Math.max(...c));

    return { counts: c, maxCount: maxVal, rms: rmsVal, mpIndex: mpIdx };
  }, [speeds, range, bins]);

  const mpPercent = ((mpIndex + 0.5) / bins) * 100;
  const rmsPercent = Math.min((rms / range) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-3">
        {/* Legend */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded p-3 text-[11px] md:text-xs text-slate-400 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-start gap-2">
                 <div className="mt-1 w-2 h-2 shrink-0 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                 <div>
                    <span className="text-red-300 font-bold block mb-0.5">v<sub>rms</sub> (Căn quân phương)</span> 
                    <span className="text-slate-500 leading-tight">Đại diện động năng trung bình. Tỷ lệ thuận với Nhiệt độ (T).</span>
                 </div>
            </div>
            <div className="flex items-start gap-2">
                 <div className="mt-1 w-0.5 h-3 shrink-0 border-l-2 border-dashed border-yellow-400 mx-[3px]"></div>
                 <div>
                    <span className="text-yellow-300 font-bold block mb-0.5">v<sub>mp</sub> (Xác suất cao nhất)</span>
                    <span className="text-slate-500 leading-tight">Tốc độ mà đa số các hạt trong bình sở hữu.</span>
                 </div>
            </div>
        </div>

        <div className="relative h-48 pt-8 pb-5 select-none mt-2">
            {/* Y Axis Label */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-slate-500 font-bold tracking-widest origin-center">
                SỐ LƯỢNG HẠT
            </div>

            {/* Chart Area */}
            <div className="h-full ml-6 relative bg-slate-800/20 rounded border-b border-l border-slate-700/50">
                 {/* Grid Lines */}
                 <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="border-t border-slate-700/20 w-full h-0"></div>
                    ))}
                 </div>

                 {/* Histogram Bars */}
                 <div className="absolute inset-0 flex items-end justify-between px-[1px]">
                     {counts.map((count, i) => {
                         const h = (count / maxCount) * 100;
                         const hue = 240 - (i / bins) * 240; 
                         return (
                             <div 
                                key={i}
                                className="flex-1 mx-[1px] rounded-t-[2px] relative group transition-all duration-300"
                                style={{ 
                                    height: `${Math.max(h, 0)}%`, 
                                    backgroundColor: `hsla(${hue}, 70%, 55%, 0.7)`
                                }}
                             >
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-slate-600 whitespace-nowrap z-30 pointer-events-none shadow-xl transition-opacity">
                                    {count}
                                </div>
                             </div>
                         )
                     })}
                 </div>

                 {/* v_mp Line */}
                 <div 
                    className="absolute bottom-0 top-0 w-px border-l-2 border-dashed border-yellow-400/60 z-10 transition-all duration-500 ease-out pointer-events-none"
                    style={{ left: `${mpPercent}%` }}
                 >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-yellow-400 font-bold whitespace-nowrap bg-slate-900/90 px-1.5 rounded border border-yellow-400/20 shadow-lg">
                        Đa số
                    </div>
                 </div>

                 {/* v_rms Line */}
                 <div 
                    className="absolute bottom-0 top-[-8px] w-0.5 bg-red-500 z-20 transition-all duration-500 ease-out pointer-events-none shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                    style={{ left: `${rmsPercent}%` }}
                 >
                     <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
                         <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap border border-red-400">
                            v<sub>rms</sub>
                         </span>
                         <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-red-600 mt-[-1px]"></div>
                     </div>
                 </div>
            </div>

            {/* X Axis Labels */}
            <div className="absolute bottom-0 left-6 right-0 flex justify-between text-[10px] text-slate-400 font-medium pt-2">
                <span className="text-cyan-500">Chậm (Lạnh)</span>
                <span className="text-slate-500 font-bold tracking-wide uppercase">Tốc độ hạt (v) &rarr;</span>
                <span className="text-red-500">Nhanh (Nóng)</span>
            </div>
        </div>
    </div>
  );
};