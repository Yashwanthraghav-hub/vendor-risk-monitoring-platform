import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, Shield, Mail, Phone, Calendar, 
  FileText, CheckCircle, AlertTriangle, ShieldCheck, 
  BrainCircuit, Sparkles, Clock, RefreshCw 
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import { PerformanceTrendChart } from '../components/ChartWidgets';

function VendorProfile() {
  const { id } = useParams();
  const { token } = useAuth();
  
  // Data State
  const [vendor, setVendor] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Simulation reminders state
  const [reminderMessage, setReminderMessage] = useState('');

  const fetchProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch Profile and Performance
      const pRes = await fetch(`/api/vendors/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!pRes.ok) throw new Error('Vendor profile not found');
      const pData = await pRes.json();
      setVendor(pData.vendor);
      setPerformance(pData.performance);

      // 2. Fetch Compliance Documents
      const dRes = await fetch(`/api/compliance?vendorId=${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (dRes.ok) {
        const dData = await dRes.json();
        setDocuments(dData);
      }

      // 3. Fetch AI Predictions
      const prRes = await fetch(`/api/vendors/${id}/predict`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (prRes.ok) {
        const prData = await prRes.json();
        setPrediction(prData);
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Error fetching profile details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [id, token]);

  const handleSendReminder = async (docId) => {
    setReminderMessage('');
    try {
      const res = await fetch(`/api/compliance/${docId}/reminder`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReminderMessage(data.message);
        // Clear message after 4s
        setTimeout(() => setReminderMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing supplier telemetry...</p>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="p-6 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
        <AlertTriangle className="h-10 w-10 text-red-500 mx-auto" />
        <h3 className="font-bold text-slate-850 dark:text-slate-200 mt-3">{error || 'Vendor profile not found'}</h3>
        <Link to="/vendors" className="inline-block mt-4 text-xs font-bold text-brand-500 uppercase">Back to Directory</Link>
      </div>
    );
  }

  // Formatting historical values for performance trend chart
  const dates = performance.map(p => new Date(p.evaluationDate).toLocaleDateString(undefined, { month: 'short', year: '2-digit' }));
  const deliveryRates = performance.map(p => p.onTimeDeliveryRate);
  const qualityScores = performance.map(p => p.qualityScore);

  const activeDocs = documents.filter(d => d.status === 'Valid');
  const expiredDocs = documents.filter(d => d.status === 'Expired');

  return (
    <div className="space-y-6">
      
      {/* Navigation Header */}
      <div className="flex items-center space-x-3">
        <Link 
          to="/vendors"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Supplier Profiles</span>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100 font-sans tracking-tight leading-none mt-1">
            {vendor.name}
          </h1>
        </div>
      </div>

      {reminderMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-450 font-bold animate-pulse">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>{reminderMessage}</span>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Profile overview & Contacts */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs bg-brand-500/10 text-brand-500 dark:text-brand-400 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
                {vendor.category}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full ${vendor.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`} title={vendor.status} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2.5 text-slate-600 dark:text-slate-350">
                <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="text-xs font-semibold">
                  <p className="text-[10px] text-slate-400 uppercase leading-none mb-1">Contract Valuation</p>
                  <p className="text-slate-800 dark:text-slate-200">${vendor.contractValue.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 text-slate-600 dark:text-slate-350">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="text-xs font-semibold">
                  <p className="text-[10px] text-slate-400 uppercase leading-none mb-1">Agreement Duration</p>
                  <p className="text-slate-800 dark:text-slate-200">
                    {new Date(vendor.contractStartDate).toLocaleDateString()} - {new Date(vendor.contractEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Contact Liaison</span>
              
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center space-x-2.5">
                  <span className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                    {vendor.contactPerson.charAt(0)}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{vendor.contactPerson}</span>
                </div>
                
                <div className="flex items-center space-x-2.5 pl-9 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  <a href={`mailto:${vendor.email}`}>{vendor.email}</a>
                </div>

                <div className="flex items-center space-x-2.5 pl-9 text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{vendor.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Risk scoring gauge card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 text-left">
              Risk Assessment Score
            </h3>
            <RiskGauge score={vendor.riskScore} />
          </div>

        </div>

        {/* Right column: Charts & AI Predictions */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Performance Trends Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Performance Telemetry Trail</h3>
              <p className="text-xs text-slate-400 font-medium">On-time delivery percentages &amp; overall service quality tracking</p>
            </div>
            <div className="h-60">
              <PerformanceTrendChart dataPoints={{ delivery: deliveryRates, quality: qualityScores }} labels={dates} />
            </div>
          </div>

          {/* AI Risk Prediction dashboard */}
          {prediction && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <BrainCircuit className="h-5 w-5 text-brand-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Rule-Based Predictive Forecasts</h3>
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse-slow" />
              </div>

              {/* Predictive percentages grids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Delivery delay probability */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Delay Probability</span>
                  <span className={`text-2xl font-extrabold ${
                    prediction.predictions.deliveryDelayProbability >= 70 ? 'text-red-500' : prediction.predictions.deliveryDelayProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {prediction.predictions.deliveryDelayProbability}%
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prediction.predictions.deliveryDelayProbability >= 70 ? 'bg-red-500' : prediction.predictions.deliveryDelayProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${prediction.predictions.deliveryDelayProbability}%` }}
                    />
                  </div>
                </div>

                {/* Compliance failure probability */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Compliance Failure</span>
                  <span className={`text-2xl font-extrabold ${
                    prediction.predictions.complianceFailureProbability >= 70 ? 'text-red-500' : prediction.predictions.complianceFailureProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {prediction.predictions.complianceFailureProbability}%
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prediction.predictions.complianceFailureProbability >= 70 ? 'bg-red-500' : prediction.predictions.complianceFailureProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${prediction.predictions.complianceFailureProbability}%` }}
                    />
                  </div>
                </div>

                {/* Performance decline probability */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800/40 rounded-xl text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Performance Decline</span>
                  <span className={`text-2xl font-extrabold ${
                    prediction.predictions.performanceDeclineProbability >= 70 ? 'text-red-500' : prediction.predictions.performanceDeclineProbability >= 40 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {prediction.predictions.performanceDeclineProbability}%
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${prediction.predictions.performanceDeclineProbability >= 70 ? 'bg-red-500' : prediction.predictions.performanceDeclineProbability >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                      style={{ width: `${prediction.predictions.performanceDeclineProbability}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Insights bullet lists */}
              <div className="pt-2.5 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Engine Analysis &amp; Warnings</span>
                <div className="space-y-2 text-xs font-semibold">
                  {prediction.insights.map((insight, index) => (
                    <div key={index} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/40">
                      {insight}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Compliance Document List details */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Verification Document Checklist</h3>
          <p className="text-xs text-slate-400 font-medium">Mandatory legal and compliance certificates verified by auditors</p>
        </div>

        {documents.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 font-semibold text-center">No certification records uploaded.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => {
              const isExpired = doc.status === 'Expired';
              const isPending = doc.status === 'Pending Renewal';
              return (
                <div 
                  key={doc._id || doc.id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between space-x-4 ${
                    isExpired 
                      ? 'bg-red-500/5 border-red-100 dark:border-red-950/20' 
                      : isPending 
                        ? 'bg-amber-500/5 border-amber-100 dark:border-amber-950/20' 
                        : 'bg-emerald-500/5 border-emerald-100 dark:border-emerald-950/20'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    {isExpired ? (
                      <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    ) : isPending ? (
                      <Clock className="h-5 w-5 text-amber-500 shrink-0 animate-pulse" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}
                    
                    <div className="truncate font-semibold">
                      <p className="text-xs text-slate-850 dark:text-slate-100 truncate">{doc.documentType}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                      isExpired ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' : isPending ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-405'
                    }`}>
                      {doc.status}
                    </span>
                    {(isExpired || isPending) && (
                      <button
                        onClick={() => handleSendReminder(doc._id || doc.id)}
                        className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-white dark:hover:bg-slate-850"
                        title="Simulate Renewal Reminder Alert"
                      >
                        <Mail className="h-4.5 w-4.5 text-brand-500" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default VendorProfile;
