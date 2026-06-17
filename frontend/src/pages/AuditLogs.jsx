import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Database, ShieldAlert, Clock, User, Info, AlertTriangle } from 'lucide-react';

function AuditLogs() {
  const { token, isAdmin } = useAuth();
  
  // Data State
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!isAdmin()) return;
      try {
        const res = await fetch('/api/audit', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch (err) {
        console.error('Error loading audit logs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [token]);

  // Enforce access control directly in view
  if (!isAdmin()) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md mx-auto mt-12 space-y-4 shadow-xl">
        <ShieldAlert className="h-12 w-12 text-red-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-200">Security Clearance Denied</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          Access restricted. The system audit trails ledger is exclusively accessible to authorized Security Administrators.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
        <p className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Loading system audit logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
          System Audit Trails
        </h1>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
          Chronological record of user adjustments, authentication checks, and database modifications
        </p>
      </div>

      {/* Logs timeline layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-6 shadow-sm">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="h-5.5 w-5.5 text-brand-500" />
            <h3 className="font-bold text-slate-850 dark:text-slate-100">Audit Logs Registry</h3>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-slate-500">
            {logs.length} Total Entries
          </span>
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold text-center py-6">No audit records found.</p>
        ) : (
          <div className="relative border-l border-slate-150 dark:border-slate-800 ml-4 pl-6 space-y-6">
            
            {logs.map((log) => {
              // Select color based on action type
              let iconBg = 'bg-brand-500';
              if (log.action.includes('Delete') || log.action.includes('Breach')) {
                iconBg = 'bg-red-500';
              } else if (log.action.includes('Create') || log.action.includes('Upload')) {
                iconBg = 'bg-emerald-500';
              } else if (log.action.includes('Update') || log.action.includes('Reset')) {
                iconBg = 'bg-amber-500';
              }

              return (
                <div key={log._id || log.id} className="relative group">
                  {/* Timeline indicator node */}
                  <span className={`absolute -left-[31px] top-1.5 h-4 w-4 rounded-full ring-4 ring-white dark:ring-slate-900 ${iconBg}`} />

                  <div className="space-y-1 bg-slate-50/50 dark:bg-slate-800/10 hover:bg-slate-50 dark:hover:bg-slate-850 p-4 border border-slate-100 dark:border-slate-800/40 rounded-2xl transition-all">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100/50 dark:border-slate-800/20 pb-2">
                      <div className="flex items-center space-x-2 font-bold text-xs">
                        <span className="text-slate-850 dark:text-slate-150 uppercase tracking-wide">{log.action}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        <span className="flex items-center space-x-1">
                          <User className="h-3.5 w-3.5 shrink-0" />
                          <span>{log.userEmail}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-start space-x-2 text-xs font-semibold text-slate-650 dark:text-slate-350 leading-relaxed">
                      <Info className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{log.details}</span>
                    </div>

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

export default AuditLogs;
