import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea
} from 'recharts';
import { GraphPoint, Phase } from '../types';

interface GraphViewProps {
  data: GraphPoint[];
  currentTemp: number;
  currentPhase: Phase;
}

const GraphView: React.FC<GraphViewProps> = ({ data, currentTemp, currentPhase }) => {
  return (
    <div className="w-full h-[320px] bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <h3 className="text-center font-bold text-slate-700 dark:text-slate-200 mb-2">Đồ thị Nhiệt độ theo Thời gian</h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#94a3b8" />
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={[0, 'auto']} 
            label={{ value: 'Thời gian (s)', position: 'insideBottomRight', offset: -5, fill: '#64748b' }} 
            tickFormatter={(val) => Math.floor(val).toString()}
            stroke="#94a3b8"
            tick={{ fill: '#64748b' }}
          />
          <YAxis 
            domain={[-25, 110]} 
            label={{ value: 'T (°C)', angle: -90, position: 'insideLeft', fill: '#64748b' }} 
            stroke="#94a3b8"
            tick={{ fill: '#64748b' }}
          />
          <Tooltip 
            labelFormatter={(label) => `t: ${Math.round(label)}s`}
            formatter={(value: number) => [`${value.toFixed(1)}°C`, 'Nhiệt độ']}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#1e293b' }}
          />
          
          {/* Reference Lines for Key Temperatures */}
          <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: '0°C', fill: '#64748b', fontSize: 10 }} />
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'right', value: '100°C', fill: '#64748b', fontSize: 10 }} />

          {/* Realtime Line */}
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#3b82f6" 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false} 
          />

          {/* Current Position Dot */}
          {data.length > 0 && (
             <ReferenceArea 
               x1={data[data.length - 1].time} 
               x2={data[data.length - 1].time} 
               stroke="#ef4444"
               strokeOpacity={0.5}
             />
          )}

        </LineChart>
      </ResponsiveContainer>
      <div className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1">
        Trạng thái: <span className="font-bold text-blue-600 dark:text-blue-400">{
          currentPhase === Phase.SOLID ? "RẮN" :
          currentPhase === Phase.MELTING ? "NÓNG CHẢY" :
          currentPhase === Phase.LIQUID ? "LỎNG" : "SÔI"
        }</span> | T = {currentTemp.toFixed(1)}°C
      </div>
    </div>
  );
};

export default GraphView;