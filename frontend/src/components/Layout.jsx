import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Users, CheckSquare, TrendingUp, FileBarChart, 
  Database, Bell, Sun, Moon, LogOut, Menu, X, User, ShieldAlert 
} from 'lucide-react';

function Layout({ children }) {
  const { user, token, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('vrmp_theme') === 'dark';
  });

  // Dark Mode Toggle
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('vrmp_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('vrmp_theme', 'light');
    }
  }, [darkMode]);

  // Fetch Alerts
  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleDismissAlert = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/alerts/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchAlerts();
      }
    } catch (err) {
      console.error('Error dismissing alert:', err);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: TrendingUp },
    { name: 'Vendors', path: '/vendors', icon: Users },
    { name: 'Compliance', path: '/compliance', icon: CheckSquare },
    { name: 'Risk Analysis', path: '/risk-analysis', icon: Shield },
    { name: 'Reports', path: '/reports', icon: FileBarChart },
  ];

  // Admin only navigation items
  if (isAdmin()) {
    navItems.push({ name: 'Audit Logs', path: '/audit-logs', icon: Database });
  }

  const unreadAlerts = alerts.filter(a => !a.isRead);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* SIDEBAR FOR MOBILE (DRAWER) */}
      <div className={`fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-72 bg-brand-950 text-white p-6 transition-transform duration-300 transform" style={{ transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-brand-400" />
              <span className="text-xl font-bold font-sans tracking-tight">VRM Platform</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-slate-400 hover:text-white" />
            </button>
          </div>
          
          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive 
                      ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center space-x-3 px-4">
              <div className="h-10 w-10 rounded-full bg-brand-700 flex items-center justify-center font-bold text-brand-100">
                {user?.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">{user?.name}</p>
                <p className="text-xs text-slate-400 leading-tight">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-950 text-white p-6 shadow-2xl border-r border-white/5 shrink-0 z-20">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/30">
            <Shield className="h-7 w-7 text-brand-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-sans tracking-tight leading-none text-white">VRM Platform</h1>
            <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">Enterprise Risk</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 font-semibold scale-102' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center space-x-3 px-2">
            <div className="h-10 w-10 rounded-full bg-brand-600 flex items-center justify-center font-bold text-white shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="font-semibold text-sm leading-tight truncate text-white">{user?.name}</p>
              <span className="inline-block px-2 py-0.5 mt-1 text-[9px] font-bold rounded-full bg-white/10 text-brand-300 border border-white/5 uppercase tracking-wider">{user?.role}</span>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Welcome back,</p>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name}</h2>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark/Light Mode Toggler */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setAlertsOpen(!alertsOpen)}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Drawer */}
              {alertsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setAlertsOpen(false)} />
                  <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-40 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <div className="flex items-center space-x-2">
                        <ShieldAlert className="h-5 w-5 text-red-500" />
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">Critical Alerts</h4>
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold">
                        {unreadAlerts.length} New
                      </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
                      {alerts.length === 0 ? (
                        <div className="py-8 text-center text-slate-400">
                          <p className="text-sm">No notifications found.</p>
                        </div>
                      ) : (
                        alerts.map((alert) => (
                          <div 
                            key={alert._id || alert.id} 
                            onClick={() => {
                              setAlertsOpen(false);
                              navigate(`/vendors/${alert.vendorId}`);
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col space-y-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                              alert.isRead 
                                ? 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-100 dark:border-slate-800/40 opacity-70' 
                                : 'bg-red-500/5 dark:bg-red-500/10 border-red-100 dark:border-red-950/30'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                alert.severity === 'High' 
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400' 
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              }`}>
                                {alert.type}
                              </span>
                              {!alert.isRead && (
                                <button 
                                  onClick={(e) => handleDismissAlert(alert._id || alert.id, e)}
                                  className="text-xs text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 font-semibold"
                                >
                                  Dismiss
                                </button>
                              )}
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-medium">{alert.message}</p>
                            <span className="text-[10px] text-slate-400">{new Date(alert.createdAt).toLocaleString()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* INNER CONTAINER (PAGES VIEWPORT) */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>

    </div>
  );
}

export default Layout;
