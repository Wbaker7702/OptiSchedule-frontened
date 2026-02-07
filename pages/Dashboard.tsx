
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, ShieldCheck, Activity, Terminal, Server, Globe, Lock, Loader2, Shield, Cloud, Database, Zap, Cpu, Network } from 'lucide-react';
import { DATE_STRING, FISCAL_METRICS, APP_VERSION, SYSTEM_HEALTH, CURRENT_STATE, LABOR_REGULATIONS, AZURE_TELEMETRY } from '../constants';
import { View } from '../types';

const data = [
  { time: '8 AM', value: 40 },
  { time: '10 AM', value: 65 },
  { time: '12 PM', value: 95 },
  { time: '2 PM', value: 80 },
  { time: '4 PM', value: 110 },
  { time: '6 PM', value: 70 },
  { time: '8 PM', value: 45 },
];

const Dashboard: React.FC<{ setCurrentView?: (view: View) => void }> = () => {
  const [pulseLogs, setPulseLogs] = useState<{id: number, msg: string, time: string}[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const reg = LABOR_REGULATIONS[CURRENT_STATE];
  
  useEffect(() => {
    const messages = [
      "AZURE_COMPUTE: East US 2 Node Nominal",
      "D365_INGRESS: ERP Handshake Secure",
      "BREEZE_SYNC: HubSpot Campaign Delta Processed",
      "SENTINEL: Edge Vision Latency 14ms",
      "CLOUD_FABRIC: High Availability Mode Active"
    ];
    
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        msg: messages[Math.floor(Math.random() * messages.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setPulseLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header title="Strategic Command" subtitle={`Node #5065 • Triple-Engine Integration Active`} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Triple Node Status Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
           {/* Azure Cloud Fabric Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-[#0078d4]/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Cloud className="w-24 h-24 text-[#0078d4]" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-[#0078d4]/10 rounded-lg border border-[#0078d4]/20">
                    <Cloud className="w-5 h-5 text-[#0078d4]" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Azure Cloud Fabric</h3>
                    <p className="text-xs font-mono text-[#0078d4] font-bold">East US 2 • Nominal</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Latency</p>
                    <p className="text-xs font-bold text-white">{AZURE_TELEMETRY.latency}</p>
                 </div>
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Compute</p>
                    <p className="text-xs font-bold text-white">{AZURE_TELEMETRY.computeUsage}</p>
                 </div>
              </div>
           </div>

           {/* Dynamics 365 ERP Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-blue-500/20 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Database className="w-24 h-24 text-blue-500" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Database className="w-5 h-5 text-blue-500" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Dynamics 365 ERP</h3>
                    <p className="text-xs font-mono text-blue-400 font-bold">Ledger Sync Active</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Leakage</p>
                    <p className="text-xs font-bold text-white">${FISCAL_METRICS.executionLeakage.toLocaleString()}</p>
                 </div>
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">ROI</p>
                    <p className="text-xs font-bold text-white">{FISCAL_METRICS.currentROI}x</p>
                 </div>
              </div>
           </div>

           {/* HubSpot Breeze Card */}
           <div className="bg-slate-900 rounded-2xl p-6 border border-[#ff7a59]/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <Zap className="w-24 h-24 text-[#ff7a59]" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                 <div className="p-2 bg-[#ff7a59]/10 rounded-lg border border-[#ff7a59]/20">
                    <Zap className="w-5 h-5 text-[#ff7a59] fill-[#ff7a59]" />
                 </div>
                 <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">HubSpot Breeze</h3>
                    <p className="text-xs font-mono text-[#ff7a59] font-bold">Loyalty Ingress Live</p>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Campaigns</p>
                    <p className="text-xs font-bold text-white">4 Active</p>
                 </div>
                 <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <p className="text-[8px] text-slate-500 uppercase font-black">Leads</p>
                    <p className="text-xs font-bold text-white">1.2k</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Charts and Logs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl relative">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <Activity className="w-4 h-4 text-emerald-500" />
                 Cognitive Deployment Matrix
               </h3>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Edge AI Processing</span>
                  </div>
               </div>
             </div>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0078d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#0078d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155'}} />
                    <Area type="monotone" dataKey="value" stroke="#0078d4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col shadow-inner">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Infrastructure Pulse</h3>
            </div>
            <div className="space-y-4 flex-1 overflow-hidden font-mono">
               {pulseLogs.map(log => (
                 <div key={log.id} className="animate-in slide-in-from-bottom-1 fade-in duration-300">
                    <p className="text-[9px] text-slate-500 flex justify-between">
                        <span>[{log.time}]</span>
                        <span className="text-blue-500/50">AZ_E2_SYNC</span>
                    </p>
                    <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5 truncate">{log.msg}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
