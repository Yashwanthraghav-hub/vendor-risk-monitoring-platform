import React from 'react';
import { useNavigate } from 'react-router-dom';

function RiskHeatMap({ vendors }) {
  const navigate = useNavigate();

  // Determine criticality based on contract value
  const getCriticality = (value) => {
    if (value >= 750000) return 'High';
    if (value >= 250000) return 'Medium';
    return 'Low';
  };

  // Determine likelihood (risk score level)
  const getLikelihood = (score) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  // Classify vendors into the 3x3 matrix
  const matrix = {
    'High-High': [], 'High-Medium': [], 'High-Low': [],
    'Medium-High': [], 'Medium-Medium': [], 'Medium-Low': [],
    'Low-High': [], 'Low-Medium': [], 'Low-Low': []
  };

  vendors.forEach(vendor => {
    const l = getLikelihood(vendor.riskScore);
    const c = getCriticality(vendor.contractValue);
    const key = `${l}-${c}`;
    if (matrix[key]) {
      matrix[key].push(vendor);
    }
  });

  const cells = [
    { key: 'High-High', bg: 'bg-red-500/20 dark:bg-red-950/30 border-red-500/40 hover:bg-red-500/30 text-red-700 dark:text-red-400', label: 'Critical Risk (Red)' },
    { key: 'High-Medium', bg: 'bg-red-400/20 dark:bg-red-900/20 border-red-400/30 hover:bg-red-400/25 text-red-600 dark:text-red-400', label: 'High Risk' },
    { key: 'High-Low', bg: 'bg-amber-500/20 dark:bg-amber-950/30 border-amber-500/30 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400', label: 'Medium Risk' },
    
    { key: 'Medium-High', bg: 'bg-red-400/20 dark:bg-red-900/20 border-red-400/30 hover:bg-red-400/25 text-red-600 dark:text-red-400', label: 'High Risk' },
    { key: 'Medium-Medium', bg: 'bg-amber-500/20 dark:bg-amber-950/30 border-amber-500/30 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400', label: 'Medium Risk' },
    { key: 'Medium-Low', bg: 'bg-emerald-500/10 dark:bg-emerald-950/10 border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', label: 'Low Risk' },
    
    { key: 'Low-High', bg: 'bg-amber-500/20 dark:bg-amber-950/30 border-amber-500/30 hover:bg-amber-500/30 text-amber-700 dark:text-amber-400', label: 'Medium Risk' },
    { key: 'Low-Medium', bg: 'bg-emerald-500/10 dark:bg-emerald-950/10 border-emerald-500/20 hover:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', label: 'Low Risk' },
    { key: 'Low-Low', bg: 'bg-emerald-500/20 dark:bg-emerald-950/20 border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-700 dark:text-emerald-400', label: 'Minimal Risk' }
  ];

  return (
    <div className="w-full flex flex-col p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Vendor Risk Heat Map</h3>
        <p className="text-xs text-slate-400 font-medium">Visualizes vendor criticality (Contract Value) vs likelihood of failure (Risk Score)</p>
      </div>

      <div className="flex flex-1">
        {/* Y Axis Label */}
        <div className="flex items-center justify-center -rotate-90 w-8 text-xs font-bold text-slate-400 uppercase tracking-widest leading-none translate-x-2">
          Likelihood (Risk Score)
        </div>

        <div className="flex-1 flex flex-col">
          {/* Main Grid */}
          <div className="grid grid-cols-3 gap-2 flex-1 min-h-[300px]">
            {/* Rows are Likelihood: High, Medium, Low */}
            {/* Columns are Criticality: High (Right), Med (Middle), Low (Left) */}
            {/* Cell mapping matches:
                Row 1 (High Likelihood): High-Low, High-Medium, High-High
                Row 2 (Med Likelihood): Medium-Low, Medium-Medium, Medium-High
                Row 3 (Low Likelihood): Low-Low, Low-Medium, Low-High */}
            
            {/* Row 1: High Likelihood */}
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">High / Low</span>
              <Cell data={matrix['High-Low']} cellStyle={cells[2]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">High / Med</span>
              <Cell data={matrix['High-Medium']} cellStyle={cells[1]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">High / High</span>
              <Cell data={matrix['High-High']} cellStyle={cells[0]} navigate={navigate} />
            </div>

            {/* Row 2: Medium Likelihood */}
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Med / Low</span>
              <Cell data={matrix['Medium-Low']} cellStyle={cells[5]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Med / Med</span>
              <Cell data={matrix['Medium-Medium']} cellStyle={cells[4]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Med / High</span>
              <Cell data={matrix['Medium-High']} cellStyle={cells[3]} navigate={navigate} />
            </div>

            {/* Row 3: Low Likelihood */}
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Low / Low</span>
              <Cell data={matrix['Low-Low']} cellStyle={cells[8]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Low / Med</span>
              <Cell data={matrix['Low-Medium']} cellStyle={cells[7]} navigate={navigate} />
            </div>
            <div className="relative flex flex-col">
              <span className="absolute top-1 left-2 text-[10px] font-bold text-slate-400 uppercase">Low / High</span>
              <Cell data={matrix['Low-High']} cellStyle={cells[6]} navigate={navigate} />
            </div>
          </div>

          {/* X Axis Labels */}
          <div className="grid grid-cols-3 gap-2 text-center mt-2 font-bold text-[11px] text-slate-400 uppercase tracking-wider">
            <div>Low Criticality (&lt;$250k)</div>
            <div>Medium Criticality ($250k-$750k)</div>
            <div>High Criticality (&gt;$750k)</div>
          </div>
          <div className="text-center mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
            Impact Criticality (Contract Value)
          </div>
        </div>
      </div>
    </div>
  );
}

// Inner Grid Cell renderer
function Cell({ data, cellStyle, navigate }) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border border-dashed transition-all duration-200 pt-6 min-h-[90px] overflow-hidden ${cellStyle.bg}`}>
      {data.length === 0 ? (
        <span className="text-[10px] font-semibold opacity-40">Empty</span>
      ) : (
        <div className="flex flex-wrap gap-1 justify-center max-h-full overflow-y-auto w-full py-1">
          {data.map(vendor => (
            <button
              key={vendor._id || vendor.id}
              onClick={() => navigate(`/vendors/${vendor._id || vendor.id}`)}
              className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-slate-900/60 border border-current hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all truncate max-w-[80px]"
              title={`${vendor.name} (Risk: ${vendor.riskScore}%, Value: $${vendor.contractValue.toLocaleString()})`}
            >
              {vendor.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default RiskHeatMap;
