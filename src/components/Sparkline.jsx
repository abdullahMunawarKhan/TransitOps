import React from 'react';

export default function Sparkline({ points, color }) {
  const width = 120;
  const height = 36;
  const padding = 3;
  const maxVal = Math.max(...points);
  const minVal = Math.min(...points);
  const range = maxVal - minVal || 1;
  
  const coords = points.map((p, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (points.length - 1);
    const y = padding + ((maxVal - p) * (height - 2 * padding)) / range;
    return `${x},${y}`;
  });
  
  const pathData = `M ${coords.join(' L ')}`;
  const gradientId = `glow-${color.replace('#', '')}`;
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Glow under line */}
      <path
        d={`${pathData} L ${width - padding},${height} L ${padding},${height} Z`}
        fill={`url(#${gradientId})`}
      />
      {/* Sparkline line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Final point dot */}
      {coords.length > 0 && (
        <circle
          cx={coords[coords.length - 1].split(',')[0]}
          cy={coords[coords.length - 1].split(',')[1]}
          r="3"
          fill={color}
        />
      )}
    </svg>
  );
}
