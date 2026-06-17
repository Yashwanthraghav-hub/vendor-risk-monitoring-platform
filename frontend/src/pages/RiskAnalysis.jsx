import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldAlert, BrainCircuit, Sparkles, Clock, 
  HelpCircle, Eye, RefreshCw, ChevronRight 
} from 'lucide-react';
import RiskHeatMap from '../components/RiskHeatMap';

function RiskAnalysis() {
  const { token } = useAuth();
  
  // Data State
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predLoading, setPredLoading] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await fetch('/api/vendors?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVendors(data.vendors);
        
        // Select first vendor by default for predictions
        if (data.vendors.length > 0) {
          const firstId = data.vendors[0]._id || data.vendors[0].id;
          setSelectedVendorId(firstId);
          fetchPrediction(firstId);
        }
      }
    } catch (err) {
      console.error('Error fetching vendors for risk analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrediction = async (vendorId) => {
    if (!vendorId) return;
    setPredLoading(true);
    try {
      const res = await fetch(`/api/vendors/${vendorId}/predict`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      }
    } catch (err) {
      console.error('Error fetching prediction:', err);
    } finally {
      setPredLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [token]);

  const handleVendorChange = (e) => {
    const id = e.target.value;
    setSelectedVendorId(id);
    fetchPrediction(id);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing predictive risk matrices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
          Risk Intelligence Engine
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
          Weighted risk models &amp; AI-driven failure prediction forecasts
        </p>
      </div>

      {/* Main Grid: Heat Map vs Weights explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Heat Map grid */}
        <div className="lg:col-span-2">
          <RiskHeatMap vendors={vendors} />
        </div>

        {/* Weights & Formula Explanation */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <HelpCircle className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Assessment Framework</h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Vendor Risk Scores (0-100) are dynamically recalculated continuously using weighted parameters:
          </p>

          <div className="space-y-3 pt-2 text-xs font-semibold">
            {/* Delivery */}
            <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40">
              <div>
                <p className="text-slate-800 dark:text-slate-200">Delivery Deficit (25%)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Weighted inverse of delivery performance.</p>
              </div>
              <span className="text-brand-500 font-bold shrink-0">Max 25 pts</span>
            </div>

            {/* Quality */}
            <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40">
              <div>
                <p className="text-slate-800 dark:text-slate-200">Quality Deficit (25%)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Weighted inverse of quality and feedback score.</p>
              </div>
              <span className="text-brand-500 font-bold shrink-0">Max 25 pts</span>
            </div>

            {/* Compliance */}
            <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40">
              <div>
                <p className="text-slate-800 dark:text-slate-200">Compliance Violations (30%)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Expired or pending certificates and licenses.</p>
              </div>
              <span className="text-brand-500 font-bold shrink-0">Max 30 pts</span>
            </div>

            {/* Contract breaches */}
            <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40">
              <div>
                <p className="text-slate-800 dark:text-slate-200">Fulfillment Penalty (10%)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Penalties for low contract fulfillment rates.</p>
              </div>
              <span className="text-brand-500 font-bold shrink-0">Max 10 pts</span>
            </div>

            {/* Volatility */}
            <div className="flex items-start justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40">
              <div>
                <p className="text-slate-800 dark:text-slate-200">Category Volatility (10%)</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Base risk points allocated by supplier industry.</p>
              </div>
              <span className="text-brand-500 font-bold shrink-0">Max 10 pts</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Risk Prediction dashboard */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-5.5 w-5.5 text-brand-500" />
            <h3 className="font-bold text-slate-850 dark:text-slate-100">AI Predictive Forecast Analytics</h3>
            <Sparkles className="h-4 w-4 text-amber-500 animate-pulse-slow shrink-0" />
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Supplier Target:</label>
            <select
              value={selectedVendorId}
              onChange={handleVendorChange}
              className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100 cursor-pointer"
            >
              {vendors.map(v => (
                <option key={v._id || v.id} value={v._id || v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>

        {predLoading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto"></div>
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            
            {/* Prediction items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Delivery delay */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800/60 rounded-2xl text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Future Delivery Delay Prob.</span>
                <span className={`text-3xl font-extrabold ${
                  prediction.predictions.deliveryDelayProbability >= 70 ? 'text-red-500' : prediction.predictions.deliveryDelayProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {prediction.predictions.deliveryDelayProbability}%
                </span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${prediction.predictions.deliveryDelayProbability >= 70 ? 'bg-red-500' : prediction.predictions.deliveryDelayProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${prediction.predictions.deliveryDelayProbability}%` }}
                  />
                </div>
              </div>

              {/* Compliance failure */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800/60 rounded-2xl text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Compliance Failure Prob.</span>
                <span className={`text-3xl font-extrabold ${
                  prediction.predictions.complianceFailureProbability >= 70 ? 'text-red-500' : prediction.predictions.complianceFailureProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {prediction.predictions.complianceFailureProbability}%
                </span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${prediction.predictions.complianceFailureProbability >= 70 ? 'bg-red-500' : prediction.predictions.complianceFailureProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${prediction.predictions.complianceFailureProbability}%` }}
                  />
                </div>
              </div>

              {/* Performance decline */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800/60 rounded-2xl text-center space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Performance Decline Prob.</span>
                <span className={`text-3xl font-extrabold ${
                  prediction.predictions.performanceDeclineProbability >= 70 ? 'text-red-500' : prediction.predictions.performanceDeclineProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  {prediction.predictions.performanceDeclineProbability}%
                </span>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${prediction.predictions.performanceDeclineProbability >= 70 ? 'bg-red-500' : prediction.predictions.performanceDeclineProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                    style={{ width: `${prediction.predictions.performanceDeclineProbability}%` }}
                  />
                </div>
              </div>

            </div>

            {/* AI Warning insights */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Telemetry Insights Summary</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {prediction.insights.map((insight, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/40 rounded-2xl text-xs font-semibold leading-relaxed"
                  >
                    {insight}
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4 font-semibold">Select a vendor to query forecasts.</p>
        )}
      </div>

    </div>
  );
}

export default RiskAnalysis;
