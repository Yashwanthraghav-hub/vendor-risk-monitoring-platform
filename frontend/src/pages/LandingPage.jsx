import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, AlertTriangle, Cpu, FileText, ArrowRight, Mail } from 'lucide-react';

function LandingPage() {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans selection:bg-brand-500 selection:text-white">
      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-500/10 rounded-xl border border-brand-500/20">
            <Shield className="h-6 w-6 text-brand-400" />
          </div>
          <span className="text-xl font-bold font-sans tracking-tight">VRM Platform</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:scale-102 transition-all">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full text-xs font-bold text-brand-300 uppercase tracking-wider">
            <span>Enterprise Vendor Security</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold font-sans leading-tight tracking-tight">
            Monitor Vendor Performance &amp; <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">Mitigate Risk</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            VRMP is a state-of-the-art vendor risk management platform designed for Fortune 500 enterprises. Automate compliance tracking, evaluate real-time performance, and use rule-based AI indicators to predict supply chain disruptions.
          </p>
          <div className="flex items-center space-x-4 pt-4">
            <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3.5 rounded-xl font-bold flex items-center space-x-2 shadow-xl shadow-brand-500/15 hover:scale-102 transition-all group">
              <span>Deploy Trial Sandbox</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#features" className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-6 py-3.5 rounded-xl font-bold transition-all">
              Learn More
            </a>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end">
          {/* Decorative elements representing dashboard */}
          <div className="w-full max-w-lg bg-gradient-to-b from-brand-950 to-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Platform Telemetry</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Global Health Index</span>
                <span className="text-2xl font-extrabold text-emerald-400">96.4%</span>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Active Suppliers</span>
                <span className="text-2xl font-extrabold text-brand-400">1,240</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-center space-x-2.5">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-xs font-bold text-red-300">Supplier Quality Breach</span>
                </div>
                <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full uppercase">Critical</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <div className="flex items-center space-x-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">Audit Reports Verified</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full uppercase">Valid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl lg:text-4xl font-extrabold font-sans">Architected for Modern Procurement</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Eliminate operational blindness. Keep your legal compliance updated, automatically compute risk indicators, and monitor supplier fulfillment profiles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Shield className="h-6 w-6 text-brand-400" />
            </div>
            <h3 className="text-lg font-bold font-sans">Automated Risk Scoring</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate supplier risk indexes continuously using weighted models tracking legal documentation, quality drops, and delays.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Cpu className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold font-sans">AI-Driven Forecasts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Determine failure probabilities, document expiry lapses, and performance decline slopes using predictive trend analytics.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold font-sans">Compliance Trackers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track regulatory licenses, ISO validations, audit papers, and calendar renewal targets with customizable alerts.
            </p>
          </div>

          <div className="bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-300 space-y-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold font-sans">Audit Trail Logs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Log every supplier adjustment, risk level change, verification update, and report generation in a tamper-proof trail.
            </p>
          </div>
        </div>
      </section>

      {/* Enterprise Statistics */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-brand-400 font-sans">99.8%</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Compliance Assurance</p>
          </div>
          <div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-emerald-400 font-sans">4.8x</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Faster Incident Resolution</p>
          </div>
          <div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-amber-400 font-sans">&lt; 2hr</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Daily Risk Calculations</p>
          </div>
          <div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-indigo-400 font-sans">$5.4B</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Contract Value Monitored</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Footer */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/5 border border-white/5 rounded-3xl p-8 lg:p-12 space-y-8">
          <div className="text-center space-y-3">
            <h3 className="text-2xl lg:text-3xl font-extrabold font-sans">Connect with a Risk Advisor</h3>
            <p className="text-slate-400 text-xs font-semibold">Ready to scale your enterprise procurement risk controls? Contact our technical team.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2">
              <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
              <h4 className="font-bold text-emerald-300">Message Received Successfully</h4>
              <p className="text-xs text-slate-400 font-medium">A technical engineer will contact you inside 1 business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Message Details</label>
                <textarea
                  required
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="How can we assist your procurement team?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/10 transition-all text-sm uppercase tracking-wider"
              >
                Send Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 border-t border-white/5 text-slate-500 text-xs">
        <p>© 2026 Vendor Risk Monitoring Platform (VRMP) Corp. All rights reserved.</p>
        <p className="mt-1 text-[10px] text-slate-600 font-medium">Enterprise Security • Certified compliance tracking system.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
