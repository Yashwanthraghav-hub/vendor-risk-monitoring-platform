import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, ShieldAlert, Clock, AlertTriangle, 
  ChevronRight, Award, TrendingDown, ArrowUpRight 
} from 'lucide-react';
import { RiskDistributionChart, PerformanceTrendChart } from '../components/ChartWidgets';

function Dashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [complianceDocs, setComplianceDocs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all vendors (without pagination for calculating statistics)
        const vRes = await fetch('/api/vendors?limit=100', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const aRes = await fetch('/api/alerts', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const cRes = await fetch('/api/compliance', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (vRes.ok && aRes.ok && cRes.ok) {
          const vData = await vRes.json();
          const aData = await aRes.json();
          const cData = await cRes.json();
          
          setVendors(vData.vendors);
          setAlerts(aData);
          setComplianceDocs(cData);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing dashboard statistics...</p>
      </div>
    );
  }

  // Statistics calculations
  const totalVendorsCount = vendors.length;
  const highRiskCount = vendors.filter(v => v.riskLevel === 'High').length;
  const medRiskCount = vendors.filter(v => v.riskLevel === 'Medium').length;
  const lowRiskCount = vendors.filter(v => v.riskLevel === 'Low').length;

  const expiredDocsCount = complianceDocs.filter(d => d.status === 'Expired').length;
  const delayAlertsCount = alerts.filter(a => a.type === 'Performance Drop' && !a.isRead).length;

  // Sorting Top performing and Highest Risk vendors
  const topPerforming = [...vendors]
    .filter(v => v.status === 'Active')
    .sort((a, b) => a.riskScore - b.riskScore) // Lower risk score is better performance
    .slice(0, 3);

  const highestRisk = [...vendors]
    .filter(v => v.status === 'Active' && v.riskScore > 40)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 3);

  // Simulated average metrics across all active vendors
  const avgDelivery = 92;
  const avgQuality = 91;

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight leading-none">
          Procurement Risk Control Center
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1.5">
          Real-time compliance analytics &amp; risk logs
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Vendors */}
        <Link 
          to="/vendors"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg hover:border-brand-500/30 transition-all duration-200"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vendors</span>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-sans">{totalVendorsCount}</h3>
            <span className="text-[10px] text-brand-500 font-semibold flex items-center space-x-0.5">
              <span>View list</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-500 dark:text-brand-400 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </Link>

        {/* High Risk Vendors */}
        <Link 
          to="/risk-analysis"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg hover:border-red-500/30 transition-all duration-200"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">High Risk Vendors</span>
            <h3 className="text-3xl font-extrabold text-rose-500 font-sans">{highRiskCount}</h3>
            <span className="text-[10px] text-rose-500 font-semibold flex items-center space-x-0.5">
              <span>Analyze heat map</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </Link>

        {/* Delayed Deliveries */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Incidents</span>
            <h3 className="text-3xl font-extrabold text-amber-500 font-sans">{delayAlertsCount}</h3>
            <span className="text-[10px] text-slate-400 font-medium leading-none block">Unread delay alerts</span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Compliance Violations */}
        <Link 
          to="/compliance"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:shadow-lg hover:border-amber-500/30 transition-all duration-200"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired Documents</span>
            <h3 className="text-3xl font-extrabold text-amber-500 font-sans">{expiredDocsCount}</h3>
            <span className="text-[10px] text-amber-500 font-semibold flex items-center space-x-0.5">
              <span>View calendar</span>
              <ChevronRight className="h-3 w-3" />
            </span>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </Link>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Performance Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">System Performance Metrics</h3>
              <p className="text-xs text-slate-400 font-medium">Average delivery rates &amp; quality compliance index trends</p>
            </div>
            <div className="text-right">
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-bold">
                Avg Quality: {avgQuality}%
              </span>
            </div>
          </div>
          <div className="h-64">
            <PerformanceTrendChart 
              dataPoints={{
                delivery: [90, 93, avgDelivery],
                quality: [89, 92, avgQuality]
              }}
              labels={['April', 'May', 'June (Current)']}
            />
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Risk Profile Spread</h3>
            <p className="text-xs text-slate-400 font-medium">Breakdown of supplier portfolio risk levels</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            {totalVendorsCount > 0 ? (
              <RiskDistributionChart 
                lowCount={lowRiskCount} 
                medCount={medRiskCount} 
                highCount={highRiskCount} 
              />
            ) : (
              <span className="text-slate-400 text-sm">No vendor data found.</span>
            )}
          </div>
        </div>

      </div>

      {/* Ranks and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Vendor Rankings (Top vs High Risk) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Fulfillment Ranking Board</h3>
            <p className="text-xs text-slate-400 font-medium">Supplier performance standings by operational indices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-500 uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>Top Stable Partners</span>
              </div>
              <div className="space-y-2">
                {topPerforming.map(v => (
                  <Link 
                    key={v._id || v.id}
                    to={`/vendors/${v._id || v.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10 hover:border-brand-500/20 transition-all"
                  >
                    <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 pr-2">{v.name}</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">Score {v.riskScore}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Highest Risk */}
            <div className="space-y-2.5">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-red-500 uppercase tracking-wider">
                <TrendingDown className="h-4 w-4" />
                <span>Exceeding Thresholds</span>
              </div>
              <div className="space-y-2">
                {highestRisk.map(v => (
                  <Link 
                    key={v._id || v.id}
                    to={`/vendors/${v._id || v.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10 hover:border-brand-500/20 transition-all"
                  >
                    <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 pr-2">{v.name}</span>
                    <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full shrink-0">Score {v.riskScore}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Live Risk Logging</h3>
              <p className="text-xs text-slate-400 font-medium">Most recent warning alerts</p>
            </div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {alerts.length} Total
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {alerts.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-sm">
                No active notifications logged.
              </div>
            ) : (
              alerts.slice(0, 3).map(alert => (
                <div 
                  key={alert._id || alert.id} 
                  className={`p-3 rounded-xl border flex items-start justify-between space-x-4 ${
                    alert.isRead 
                      ? 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/40 opacity-70' 
                      : 'bg-red-500/5 dark:bg-red-500/5 border-red-100 dark:border-red-950/20'
                  }`}
                >
                  <div className="space-y-1 truncate">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        alert.severity === 'High' 
                          ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{alert.vendorName}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-normal truncate">{alert.message}</p>
                  </div>
                  <Link 
                    to={`/vendors/${alert.vendorId}`} 
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
