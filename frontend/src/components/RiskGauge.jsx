import React from 'react';

function RiskGauge({ score }) {
  // Angle calculations for the gauge needle (range from -90deg to +90deg)
  const angle = (score / 100) * 180 - 90;
  
  let colorClass = 'text-emerald-500';
  let level = 'Low Risk';
  if (score >= 70) {
    colorClass = 'text-rose-500';
    level = 'High Risk';
  } else if (score >= 40) {
    colorClass = 'text-amber-500';
    level = 'Medium Risk';
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-48 h-28 overflow-hidden">
        {/* SVG Arch */}
        <svg className="w-full h-full" viewBox="0 0 100 50">
          {/* Background Arc */}
          <path
            d="M 10 50 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            className="dark:stroke-slate-800"
          />
          {/* Green Segment (0-40) */}
          <path
            d="M 10 50 A 40 40 0 0 1 42 18"
            fill="none"
            stroke="#10b981"
            strokeWidth="10"
          />
          {/* Yellow Segment (40-70) */}
          <path
            d="M 42 18 A 40 40 0 0 1 78 26"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="10"
          />
          {/* Red Segment (70-100) */}
          <path
            d="M 78 26 A 40 40 0 0 1 90 50"
            fill="none"
            stroke="#ef4444"
            strokeWidth="10"
          />
        </svg>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1.5 h-16 bg-slate-800 dark:bg-slate-200 origin-bottom rounded-t-full transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translateX(-50%) rotate(${angle}deg)` 
          }}
        />
        
        {/* Hub */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 dark:bg-slate-200 rounded-full border-2 border-white dark:border-slate-900" />
      </div>

      {/* Numerical Score */}
      <div className="text-center mt-2">
        <span className={`text-4xl font-extrabold font-sans ${colorClass}`}>{score}</span>
        <span className="text-slate-400 text-sm font-semibold">/100</span>
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wide">
          {level}
        </h4>
      </div>
    </div>
  );
}

export default RiskGauge;
