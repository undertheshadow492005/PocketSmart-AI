import React, { useState } from 'react';
import { formatINR } from '../utils/formatters';

interface Slice {
  label: string;
  value: number;
  color?: string;
  percentage?: number;
}

interface BudgetPieChartProps {
  data: Slice[];
  total: number;
  currency: 'INR' | 'USD';
  exchangeRate?: number;
  centerTitle?: string;
}

const PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#6366f1', // indigo
];

export const BudgetPieChart: React.FC<BudgetPieChartProps> = ({
  data,
  total,
  currency,
  exchangeRate = 86.5,
  centerTitle = 'Budget Split',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const safeTotal = total > 0 ? total : data.reduce((acc, d) => acc + d.value, 0) || 1;

  // Compute angles for donut slices
  let cumulativeAngle = 0;
  const radius = 80;
  const innerRadius = 52;
  const center = 100;

  const slices = data.map((item, idx) => {
    const value = Math.max(item.value, 0);
    const fraction = value / safeTotal;
    const angle = fraction * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle += angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData =
      angle >= 359.9
        ? `M ${center - radius} ${center} A ${radius} ${radius} 0 1 0 ${center + radius} ${center} A ${radius} ${radius} 0 1 0 ${center - radius} ${center} M ${center - innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center + innerRadius} ${center} A ${innerRadius} ${innerRadius} 0 1 1 ${center - innerRadius} ${center} Z`
        : `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;

    const color = item.color || PALETTE[idx % PALETTE.length];
    const percentage = item.percentage ?? Math.round(fraction * 100);

    return {
      ...item,
      pathData,
      color,
      percentage,
      angle,
    };
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 200 200" className="w-full h-full transform transition-transform">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              stroke="#0f172a"
              strokeWidth="2"
              className="transition-all duration-200 cursor-pointer hover:opacity-90"
              style={{
                transform: hoveredIndex === i ? 'scale(1.03)' : 'scale(1)',
                transformOrigin: '100px 100px',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
            {hoveredIndex !== null ? slices[hoveredIndex].label : centerTitle}
          </span>
          <span className="text-base font-bold text-white">
            {hoveredIndex !== null
              ? formatINR(slices[hoveredIndex].value, currency, exchangeRate)
              : formatINR(safeTotal, currency, exchangeRate)}
          </span>
          {hoveredIndex !== null && (
            <span className="text-xs font-semibold text-emerald-400">
              {slices[hoveredIndex].percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {slices.map((slice, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
              hoveredIndex === i ? 'bg-slate-800/90 ring-1 ring-slate-700' : 'bg-slate-950/40 hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-200 font-medium truncate">{slice.label}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="font-semibold text-white block">
                {formatINR(slice.value, currency, exchangeRate)}
              </span>
              <span className="text-[10px] text-slate-400">{slice.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
