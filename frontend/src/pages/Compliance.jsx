import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle, AlertTriangle, Clock, Calendar, 
  Upload, FileText, Mail, ShieldCheck, AlertCircle 
} from 'lucide-react';
import ComplianceCalendar from '../components/ComplianceCalendar';
import { ComplianceStatusChart } from '../components/ChartWidgets';

function Compliance() {
  const { token, isAuthorizedForEdit } = useAuth();
  
  // Data State
  const [documents, setDocuments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    vendorId: '',
    documentType: 'ISO Certificate',
    expiryDate: '',
  });

  const fetchData = async () => {
    try {
      const dRes = await fetch('/api/compliance', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const vRes = await fetch('/api/vendors?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (dRes.ok && vRes.ok) {
        const dData = await dRes.json();
        const vData = await vRes.json();
        setDocuments(dData);
        setVendors(vData.vendors);
        
        // Auto-select first vendor for dropdown if available
        if (vData.vendors.length > 0) {
          setFormData(prev => ({ ...prev, vendorId: vData.vendors[0]._id || vData.vendors[0].id }));
        }
      }
    } catch (err) {
      console.error('Error fetching compliance dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleSendReminder = async (docId) => {
    setSuccessMessage('');
    try {
      const res = await fetch(`/api/compliance/${docId}/reminder`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenUploadModal = () => {
    setFormError('');
    setSuccessMessage('');
    setFormData({
      vendorId: vendors[0]?._id || vendors[0]?.id || '',
      documentType: 'ISO Certificate',
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months default
    });
    setUploadModalOpen(true);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.vendorId) {
      setFormError('Please select a vendor.');
      return;
    }

    try {
      const res = await fetch('/api/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setUploadModalOpen(false);
        setSuccessMessage('Compliance document uploaded & logged successfully.');
        setTimeout(() => setSuccessMessage(''), 4000);
        fetchData();
      } else {
        const errorData = await res.json();
        setFormError(errorData.message || 'Verification upload failed');
      }
    } catch (err) {
      console.error(err);
      setFormError('Error communicating with compliance server');
    }
  };

  const getVendorName = (vendorId) => {
    const v = vendors.find(item => item._id === vendorId || item.id === vendorId);
    return v ? v.name : 'Unknown Vendor';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Loading compliance calendars...</p>
      </div>
    );
  }

  // Count summaries
  const validCount = documents.filter(d => d.status === 'Valid').length;
  const expiredCount = documents.filter(d => d.status === 'Expired').length;
  const pendingCount = documents.filter(d => d.status === 'Pending Renewal').length;

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
            Compliance Management
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Track vendor certificates, audit checks, and contract expections
          </p>
        </div>
        {isAuthorizedForEdit() && (
          <button
            onClick={handleOpenUploadModal}
            className="inline-flex items-center space-x-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 hover:scale-102 transition-all shrink-0"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-450 font-bold animate-pulse">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Valid */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Valid Documents</span>
            <h3 className="text-2xl font-extrabold text-emerald-500 font-sans">{validCount}</h3>
          </div>
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl">
            <CheckCircle className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Expired */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expired Documents</span>
            <h3 className="text-2xl font-extrabold text-red-500 font-sans">{expiredCount}</h3>
          </div>
          <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
        </div>

        {/* Pending Renewal */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Renewal (30 Days)</span>
            <h3 className="text-2xl font-extrabold text-amber-500 font-sans">{pendingCount}</h3>
          </div>
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
            <Clock className="h-5.5 w-5.5" />
          </div>
        </div>

      </div>

      {/* Main split: Calendar & Status Spread */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Calendar widget */}
        <div className="lg:col-span-2">
          <ComplianceCalendar 
            documents={documents} 
            vendors={vendors} 
            onSendReminder={handleSendReminder} 
          />
        </div>

        {/* Status spread chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Audit Status Distribution</h3>
            <p className="text-xs text-slate-400 font-medium">Global ratio of valid, pending, and expired filings</p>
          </div>
          <div className="h-60 flex items-center justify-center">
            {documents.length > 0 ? (
              <ComplianceStatusChart 
                validCount={validCount} 
                expiredCount={expiredCount} 
                pendingCount={pendingCount} 
              />
            ) : (
              <span className="text-slate-400 text-sm">No compliance files found.</span>
            )}
          </div>
        </div>

      </div>

      {/* Overall Document Registers Grid List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Global Verification Ledger</h3>
          <p className="text-xs text-slate-400 font-medium">Consolidated listing of legal compliance documentation</p>
        </div>

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
                    <Clock className="h-5 w-5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                  )}
                  
                  <div className="truncate font-semibold">
                    <p className="text-xs text-slate-850 dark:text-slate-100 truncate">{getVendorName(doc.vendorId)}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {doc.documentType} • Exp: {new Date(doc.expiryDate).toLocaleDateString()}
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
                      title="Send Renewal Email Notification"
                    >
                      <Mail className="h-4.5 w-4.5 text-brand-500" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* UPLOAD SIMULATION DIALOG MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setUploadModalOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">Upload Auditor Certificate</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">Close</button>
            </div>

            {formError && (
              <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-700 dark:text-red-400 font-semibold">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor/Supplier</label>
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                >
                  {vendors.map(v => (
                    <option key={v._id || v.id} value={v._id || v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Certificate Category</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                >
                  <option value="ISO Certificate">ISO Certificate</option>
                  <option value="Business License">Business License</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="Insurance">Insurance Policy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Expiration Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-brand-500/25 transition-all"
                >
                  Upload &amp; Log
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Compliance;
