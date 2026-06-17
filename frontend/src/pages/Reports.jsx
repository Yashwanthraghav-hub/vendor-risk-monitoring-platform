import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, Download, Printer, Plus, 
  CheckCircle, FileSpreadsheet, ShieldCheck, AlertCircle 
} from 'lucide-react';

function Reports() {
  const { token, user } = useAuth();
  
  // Data State
  const [reports, setReports] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [activeReport, setActiveReport] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formError, setFormError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Performance',
    format: 'PDF'
  });

  const fetchData = async () => {
    try {
      const rRes = await fetch('/api/reports', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const vRes = await fetch('/api/vendors?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (rRes.ok && vRes.ok) {
        const rData = await rRes.json();
        const vData = await vRes.json();
        setReports(rData);
        setVendors(vData.vendors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!formData.title.trim()) {
      setFormError('Please enter a report title.');
      return;
    }

    try {
      const res = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newReport = await res.json();
        setSuccessMessage('Report generated & logged in database.');
        setFormData({ title: '', type: 'Performance', format: 'PDF' });
        setTimeout(() => setSuccessMessage(''), 4000);
        fetchData();
        setActiveReport(newReport);
      } else {
        const errorData = await res.json();
        setFormError(errorData.message || 'Report generation failed');
      }
    } catch (err) {
      console.error(err);
      setFormError('Connection error during report generation');
    }
  };

  // Natively triggers window printing
  const handlePrint = () => {
    window.print();
  };

  // Generates CSV of current vendors directory for Excel simulation download
  const handleExportCSV = (reportTitle) => {
    if (vendors.length === 0) return;
    
    // Header columns
    const headers = ['Vendor Name', 'Category', 'Contract Value ($)', 'Risk Score', 'Risk Level', 'Status', 'Contact Person', 'Email'];
    const rows = vendors.map(v => [
      v.name,
      v.category,
      v.contractValue,
      v.riskScore,
      v.riskLevel,
      v.status,
      v.contactPerson,
      v.email
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing reporting schemas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="no-print">
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
          Export &amp; Reporting Center
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
          Compile operational audits, risk matrix summaries, and download spreadsheets
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-450 font-bold animate-pulse no-print">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grid: Create report vs List of reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        
        {/* Creator panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Plus className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Compile Report</h3>
          </div>

          {formError && (
            <div className="p-3 bg-red-500/15 border border-red-500/20 rounded-xl flex items-center space-x-2 text-xs text-red-700 dark:text-red-400 font-bold">
              <AlertCircle className="h-4.5 w-4.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleGenerateReport} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Report Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-850 dark:text-slate-100"
                placeholder="e.g. Q2 Supply Chain Assessment"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Focus Area</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value="Performance">Performance Review</option>
                <option value="Risk">Risk Assessment</option>
                <option value="Compliance">Compliance Status</option>
                <option value="Procurement">Procurement Summary</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Export Type</label>
              <select
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-brand-500 font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value="PDF">Printable PDF Layout</option>
                <option value="Excel">Excel Spreadsheet CSV</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-brand-500/25 transition-all text-xs uppercase tracking-wider"
            >
              Generate Compiled File
            </button>
          </form>
        </div>

        {/* Generated listing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 lg:col-span-2 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Document Registry</h3>
            <p className="text-xs text-slate-400 font-medium">History of compiled and requested sheets</p>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 font-semibold">No report histories found.</p>
            ) : (
              reports.map(rep => (
                <div 
                  key={rep._id || rep.id}
                  onClick={() => setActiveReport(rep)}
                  className={`p-3 rounded-2xl border flex items-center justify-between space-x-4 cursor-pointer transition-all ${
                    activeReport?._id === rep._id || activeReport?.id === rep.id
                      ? 'bg-brand-500/5 border-brand-500' 
                      : 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className="p-2 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded-xl shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate font-semibold">
                      <p className="text-xs text-slate-850 dark:text-slate-100 truncate">{rep.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">
                        {rep.type} • Compiled by: {rep.generatedBy}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full shrink-0 ${
                    rep.format === 'PDF' 
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' 
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}>
                    {rep.format}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Printable visual representation sheet */}
      {activeReport && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden print-card">
          
          {/* Cover glow strip */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-500 no-print" />

          {/* Action trigger Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 no-print">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Document Viewer</span>
            <div className="flex items-center space-x-2">
              {activeReport.format === 'PDF' ? (
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print Report</span>
                </button>
              ) : (
                <button
                  onClick={() => handleExportCSV(activeReport.title)}
                  className="inline-flex items-center space-x-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Excel CSV</span>
                </button>
              )}
            </div>
          </div>

          {/* PRINTABLE COMPILATION VIEWPORT */}
          <div className="space-y-6 font-sans">
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none uppercase font-sans">
                  {activeReport.title}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-2">
                  Category Area: {activeReport.type} | Reference Identifier: {activeReport._id || activeReport.id}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 font-semibold leading-relaxed">
                <p>Date Compiled: {new Date(activeReport.createdAt).toLocaleString()}</p>
                <p>Auditor: {activeReport.generatedBy}</p>
              </div>
            </div>

            {/* Standard stats breakdown */}
            <div className="grid grid-cols-4 gap-4 py-4 text-center">
              <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Active Suppliers</span>
                <span className="text-2xl font-extrabold text-slate-800 font-sans">{vendors.length}</span>
              </div>
              <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">High Risk Risk Score</span>
                <span className="text-2xl font-extrabold text-red-500 font-sans">
                  {vendors.filter(v => v.riskLevel === 'High').length}
                </span>
              </div>
              <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Category Count</span>
                <span className="text-2xl font-extrabold text-slate-800 font-sans">6</span>
              </div>
              <div className="p-3 border border-slate-100 rounded-2xl bg-slate-50/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Operational Status</span>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block mt-1">Audited</span>
              </div>
            </div>

            {/* Structured Table representation */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monitored Supplier Ledger</h3>
              
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Vendor Name</th>
                    <th className="py-2.5 px-4">Focus Area</th>
                    <th className="py-2.5 px-4">Valuation ($)</th>
                    <th className="py-2.5 px-4">Risk Level</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {vendors.map(v => (
                    <tr key={v._id || v.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{v.name}</td>
                      <td className="py-3 px-4">{v.category}</td>
                      <td className="py-3 px-4">${v.contractValue.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.riskLevel === 'High' ? 'bg-red-50 text-red-700' : v.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-705'
                        }`}>
                          {v.riskLevel} ({v.riskScore})
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[10px] uppercase font-bold">{v.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Verification Footer signoff */}
            <div className="pt-8 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Vendor Risk Monitoring Platform © 2026</span>
              <span>Auditor Sign-off Signature: _______________________</span>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Reports;
