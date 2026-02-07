import React, { useState } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeftRight, TrendingDown, TrendingUp, Store, Globe, Activity, ArrowUpRight, ArrowDownRight, Scale, Zap, Target, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { FISCAL_METRICS, STORE_2080_METRICS, STORE_NUMBER, COMPARISON_STORE } from '../constants';

const initialChartData = [
  { hour: '8 AM', store5065: 45, store2080: 38 },
  { hour: '10 AM', store5065: 65, store2080: 72 },
  { hour: '12 PM', store5065: 95, store2080: 88 },
  { hour: '2 PM', store5065: 80, store2080: 95 },
  { hour: '4 PM', store5065: 110, store2080: 105 },
  { hour: '6 PM', store5065: 70, store2080: 82 },
  { hour: '8 PM', store5065: 45, store2080: 50 },
];

const strategyComparison = [
  { sector: 'Front End', s5065: 'Fixed Shift (8hr)', s2080: 'Dynamic Flex (4-6hr)', recommendation: 'Deploy Flex Model' },
  { sector: 'Inventory', s5065: 'Daily Audit', s2080: 'Sentinel Real-time', recommendation: 'Upgrade Node Ingress' },
  { sector: 'Overtime', s5065: 'Manager Override', s2080: 'Breeze Predictive', recommendation: 'Automate OT Mitigation' },
  { sector: 'Campaigns', s5065: 'Post-hoc Sync', s2080: 'Active HubSpot Link', recommendation: 'Connect Breeze Agent' },
];

const Comparison: React.FC = () => {
  const [chartData, setChartData] = useState(initialChartData);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isApplied, setIsApplied] = useState(false);

  const metricsDiff = {
    leakage: ((STORE_2080_METRICS.executionLeakage - FISCAL_METRICS.executionLeakage) / FISCAL_METRICS.executionLeakage) * 100,
    roi: ((STORE_2080_METRICS.currentROI - FISCAL_METRICS.currentROI) / FISCAL_METRICS.currentROI) * 100,
    surplus: STORE_2080_METRICS.laborSurplusPct - FISCAL_METRICS.laborSurplusPct
  };

  const handleApplyBaseline = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      // Logic to "Sync" 5065 data to be more like 2080
      const optimizedData = chartData.map(d => ({
        ...d,
        // Converge 5065 towards 2080 values for "Optimized Efficiency"
        store5065: Math.round((d.store5065 + d.store2080) / 2)
      }));
      setChartData(optimizedData);
      setIsSyncing(false);
      setIsApplied(true);
    }, 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar">
      <Header 
        title="Market Comparison Analysis" 
        subtitle={`Comparative benchmarking: Store #${STORE_NUMBER} vs Store #${COMPARISON_STORE}`} 
      />

      {isSyncing && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
           <div className="w-24 h-24 mb-6 relative">
             <RefreshCw className="w-24 h-24 text-blue-500 animate-spin opacity-20" />
             <div className="absolute inset-0 flex items-center justify-center">
               <Zap className="w-10 h-10 text-orange-400 animate-pulse" />
             </div>
           </div>
           <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">Synchronizing Global Baseline</h3>
           <p className="text-xs text-slate-500 font-mono mb-8 uppercase tracking-widest">Applying Store #2080 Labor Optimization Frames to Store #5065</p>
           <div className="w-full max-w-md bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
             <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${syncProgress}%` }}></div>
           </div>
           <p className="text-[10px] text-blue-400 font-mono mt-4 font-black uppercase tracking-widest">{syncProgress}% Complete</p>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        {/* Header Comparison Banner */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group shadow-2xl">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Store className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">Baseline Node</span>
              <h3 className="text-2xl font-black text-white mt-2">Store #{STORE_NUMBER}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Urban Supercenter Profile</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Wkly Leakage</p>
                   <p className="text-lg font-black text-white">${(FISCAL_METRICS.executionLeakage/1000).toFixed(1)}k</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Labor Surplus</p>
                   <p className="text-lg font-black text-white">{isApplied ? '4.2' : FISCAL_METRICS.laborSurplusPct}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-slate-800 p-4 rounded-full border border-slate-700 shadow-xl z-10">
               <ArrowLeftRight className="w-6 h-6 text-slate-400" />
            </div>
          </div>

          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group border-orange-500/20 shadow-2xl">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <Globe className="w-32 h-32 text-orange-500" />
            </div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">Benchmark Target</span>
              <h3 className="text-2xl font-black text-white mt-2">Store #{COMPARISON_STORE}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">Suburban Expansion Node</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Wkly Leakage</p>
                   <p className="text-lg font-black text-orange-400">${(STORE_2080_METRICS.executionLeakage/1000).toFixed(1)}k</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                   <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Labor Surplus</p>
                   <p className="text-lg font-black text-orange-400">{STORE_2080_METRICS.laborSurplusPct}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Divergence Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <div>
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Market Traffic Divergence
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">Comparing real-time ingress volume across nodes.</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[9px] font-black text-slate-400 uppercase">#5065 {isApplied && '(Optimized)'}</span></div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-[9px] font-black text-slate-400 uppercase">#2080</span></div>
               </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="color5065" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="color2080" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 700}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px'}} />
                  <Area type="monotone" dataKey="store5065" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#color5065)" name="Store 5065 Traffic" />
                  <Area type="monotone" dataKey="store2080" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#color2080)" name="Store 2080 Traffic" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 flex flex-col justify-between shadow-xl">
            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-orange-400" />
                Variance Gap Analysis
              </h4>
              <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Leakage Delta</span>
                      <span className={`text-xs font-black ${isApplied ? 'text-emerald-400' : 'text-orange-400'} flex items-center gap-1`}>
                        <TrendingDown className="w-3 h-3" /> {isApplied ? '94.2%' : (Math.abs(metricsDiff.leakage)).toFixed(1) + '%'} Improvement
                      </span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`transition-all duration-1000 ${isApplied ? 'bg-emerald-500 w-[94%]' : 'bg-emerald-500 w-[66%]'}`} h-full rounded-full></div>
                   </div>
                   <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase">{isApplied ? 'Optimal baseline reached.' : 'Store 2080 shows superior variance control.'}</p>
                </div>

                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Efficiency Delta</span>
                      <span className="text-xs font-black text-orange-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {isApplied ? '26.4%' : (metricsDiff.roi).toFixed(1) + '%'} Gain
                      </span>
                   </div>
                   <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`transition-all duration-1000 bg-orange-500 h-full rounded-full ${isApplied ? 'w-[98%]' : 'w-[82%]'}`}></div>
                   </div>
                   <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase">Node 2080 utilizes more automation triggers.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800">
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                     <Zap className="w-3 h-3 text-orange-400" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Sentinel Recommendation</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    {isApplied ? '"Protocol Frame applied. Store 5065 is now mirroring optimal suburban flex staffing levels."' : '"Sync Store 5065 policy frame to Match 2080\'s zone-based labor allocation strategy. Potential weekly recovery: $8,300."'}
                  </p>
               </div>
            </div>
          </div>
        </div>

        {/* Action Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
           <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                 <Scale className="w-4 h-4 text-blue-500" />
                 Cross-Node Strategy Transfer
              </h4>
              <button 
                onClick={handleApplyBaseline}
                disabled={isApplied}
                className={`text-[10px] font-black uppercase tracking-widest transition-all py-2 px-4 rounded-lg flex items-center gap-2 ${isApplied ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'}`}
              >
                {isApplied ? <><CheckCircle2 className="w-3 h-3" /> Baseline Applied</> : <><RefreshCw className="w-3 h-3" /> Apply Global Baseline</>}
              </button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono">
                 <thead className="bg-slate-950 text-slate-500 uppercase font-black">
                    <tr>
                       <th className="px-8 py-4">Operational Sector</th>
                       <th className="px-8 py-4">#5065 Method</th>
                       <th className="px-8 py-4">#2080 Method</th>
                       <th className="px-8 py-4">Sentinel Recommendation</th>
                       <th className="px-8 py-4 text-right">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    {strategyComparison.map((row, i) => (
                       <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-8 py-4 text-white font-black">{row.sector}</td>
                          <td className="px-8 py-4 text-slate-400">{isApplied ? row.s2080 : row.s5065}</td>
                          <td className="px-8 py-4 text-orange-400 font-bold">{row.s2080}</td>
                          <td className="px-8 py-4 text-blue-400 italic">"{row.recommendation}"</td>
                          <td className="px-8 py-4 text-right">
                             <div className={`flex items-center justify-end gap-2 text-[9px] font-black uppercase ${isApplied ? 'text-emerald-500' : 'text-slate-600'}`}>
                                {isApplied ? <CheckCircle2 className="w-3 h-3" /> : <Activity className="w-3 h-3" />} {isApplied ? 'Implemented' : 'Ready'}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Comparison;