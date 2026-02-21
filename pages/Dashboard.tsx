
import React, { useMemo } from 'react';
import Header from '../components/Header';
import { Cloud, Database, Zap, ShieldCheck, Lock, Server, Activity, Bell } from 'lucide-react';
import { View } from '../types';

const Dashboard: React.FC<{ setCurrentView?: (view: View) => void }> = () => {
  
  return (
    <div className="flex-1 bg-[#020617] overflow-auto custom-scrollbar font-sans text-slate-200">
      <div className="p-6 flex justify-between items-center bg-slate-900/50 border-b border-slate-800">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Strategic Command</h1>
            <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">Node #5065 • Triple-Engine Integration Active</p>
        </div>
        <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
            </button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white border border-blue-400">
                WB
            </div>
        </div>
      </div>
      
      <div className="p-8 max-w-7xl mx-auto space-y-6 pb-24">
        
        {/* Hardening Phase Status Card */}
        <div className="bg-slate-900/80 rounded-3xl p-1 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <div className="p-6 flex items-center gap-6">
                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <ShieldCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="flex-1">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest mb-1">Q1 2026 Hardening Phase Active</h2>
                    <p className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                        Sentinel Secure Node Integration • Linter v3.1 Deployed
                    </p>
                </div>
                <div className="px-4 py-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Infrastructure Hardened</span>
                </div>
            </div>
        </div>

        {/* Azure Cloud Fabric Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-blue-500/30 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Cloud className="w-32 h-32 text-blue-500" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Cloud className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Azure Cloud Fabric</h3>
                        <p className="text-[10px] text-blue-400 font-mono uppercase">East US 2 • Nominal</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Latency</p>
                        <p className="text-xl font-black text-white">18ms</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Compute</p>
                        <p className="text-xl font-black text-white">42%</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Dynamics 365 ERP Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-emerald-500/30 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Database className="w-32 h-32 text-emerald-500" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Lock className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Dynamics 365 ERP</h3>
                        <p className="text-[10px] text-emerald-400 font-mono uppercase">Secure Node • Encrypted</p>
                    </div>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Execution Leakage</p>
                        <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Protected</p>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* HubSpot Breeze Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-[#ff7a59]/30 shadow-lg relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                <Zap className="w-32 h-32 text-[#ff7a59]" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#ff7a59]/10 rounded-lg border border-[#ff7a59]/20">
                        <Zap className="w-5 h-5 text-[#ff7a59]" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">HubSpot Breeze</h3>
                        <p className="text-[10px] text-[#ff7a59] font-mono uppercase">Ingress Active • Live</p>
                    </div>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-[9px] text-white font-black uppercase tracking-widest">Campaign Delta Stream Enabled</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
