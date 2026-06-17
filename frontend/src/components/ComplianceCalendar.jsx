import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Mail, AlertTriangle } from 'lucide-react';

function ComplianceCalendar({ documents, vendors, onSendReminder }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation helpers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Get vendor name by ID helper
  const getVendorName = (vendorId) => {
    const v = vendors.find(item => item._id === vendorId || item.id === vendorId);
    return v ? v.name : 'Unknown Vendor';
  };

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // day of week index (0 = Sun)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Map documents to their expiry days in the current year and month
  const expiriesByDay = {};
  const currentMonthDocs = [];

  documents.forEach(doc => {
    const expDate = new Date(doc.expiryDate);
    if (expDate.getFullYear() === year && expDate.getMonth() === month) {
      const day = expDate.getDate();
      if (!expiriesByDay[day]) {
        expiriesByDay[day] = [];
      }
      expiriesByDay[day].push(doc);
      currentMonthDocs.push(doc);
    }
  });

  const calendarCells = [];
  // Empty slots for previous month offset
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-10 border border-slate-100 dark:border-slate-800/40 bg-slate-50/20 dark:bg-slate-900/10" />);
  }

  // Days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayExpiries = expiriesByDay[day] || [];
    const hasExpiry = dayExpiries.length > 0;
    
    // Choose status color
    let dayBg = '';
    if (hasExpiry) {
      const hasExpired = dayExpiries.some(d => d.status === 'Expired');
      dayBg = hasExpired 
        ? 'bg-red-500/15 text-red-700 dark:text-red-400 font-bold border border-red-300 dark:border-red-950/60' 
        : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold border border-amber-300 dark:border-amber-950/60';
    }

    calendarCells.push(
      <div 
        key={`day-${day}`} 
        className={`h-10 border border-slate-100 dark:border-slate-800/40 flex flex-col items-center justify-center relative text-xs rounded transition-all ${dayBg}`}
        title={hasExpiry ? `${dayExpiries.length} document(s) expiring` : ''}
      >
        <span>{day}</span>
        {hasExpiry && (
          <span className={`h-1.5 w-1.5 rounded-full absolute bottom-1 ${
            dayExpiries.some(d => d.status === 'Expired') ? 'bg-red-500' : 'bg-amber-500'
          }`} />
        )}
      </div>
    );
  }

  // Grid columns for Days of Week headers
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-brand-500" />
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Compliance Calendar</h3>
        </div>
        <div className="flex items-center space-x-1.5">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 w-28 text-center uppercase tracking-wider">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {daysOfWeek.map(d => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1">
            {d}
          </div>
        ))}
        {calendarCells}
      </div>

      {/* Expiry Details of Current Month */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex-1">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Expiries in {monthNames[month]} ({currentMonthDocs.length})
        </h4>
        
        {currentMonthDocs.length === 0 ? (
          <div className="py-4 text-center text-slate-400 text-xs font-medium">
            No document renewals required in this timeframe.
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {currentMonthDocs.map((doc) => {
              const expDate = new Date(doc.expiryDate);
              const isExpired = doc.status === 'Expired';
              return (
                <div 
                  key={doc._id || doc.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-800/10"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    {isExpired ? (
                      <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0 animate-ping" />
                    )}
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {getVendorName(doc.vendorId)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {doc.documentType} • Exp: {expDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onSendReminder(doc._id || doc.id)}
                    className="p-1.5 rounded-lg border border-brand-500/20 text-brand-500 hover:bg-brand-500 hover:text-white dark:text-brand-400 dark:hover:bg-brand-500/20 transition-all flex items-center space-x-1 font-semibold text-[10px] uppercase tracking-wider"
                    title="Send Email Renewal Alert"
                  >
                    <Mail className="h-3 w-3" />
                    <span>Notify</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default ComplianceCalendar;
