
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Coins, Zap, Activity, Clock, ShieldCheck, TrendingUp, DollarSign, ArrowUpRight, CheckCircle2, Loader2, Landmark, History, Server, Database, Cloud, Shield, CalendarDays, Info } from 'lucide-react';
import { ROYALTY_METRICS, STORE_NUMBER, CURRENT_STATE, LABOR_REGULATIONS } from '../constants';

const efficiencyTrend = [
  { hour: '8 AM', gain: 1.2 },
  { hour: '10 AM', gain: 2.5 },
  { hour: '12 PM', gain: 4.8 },
  { hour: '2 PM', gain: 3.1 },
  { hour: '4 PM', gain: 5.5 },
  { hour: '6 PM', gain: 4.2 },
  { hour: '8 PM', gain: 3.8 },
  { hour: '10 PM', gain: 4.0 },
];

const RoyaltyDashboard: React.FC = () => {
  const [liveSales, setLiveSales] = useState(42350);
  const [accruedRoyalty, setAccruedRoyalty] = useState(1540.25);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState('');
  const [showAmortizationDetails, setShowAmortizationDetails] = useState(false);
  
  const reg = LABOR_REGULATIONS[CURRENT_STATE];

  // Simulation of live updates for "Watching your royalty grow"
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSales(prev => prev + Math.floor(Math.random() * 200));
      // Royalty is 15% of the efficiency gain. 
      // Gain is roughly 3.2% of sales in our mock scenario.
      setAccruedRoyalty(prev => prev + (Math.random() * 0.85));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestPayout = () => {
    setIsProcessing(true);
    setPayoutSuccess(false);
    
    const steps = [
      "Verifying Azure Compute Logs...",
      "Validating HubSpot Ingress Signals...",
      "Calculating Efficiency Delta...",
      "Securing Triple-Engine Handshake...",
      "Committing to Dynamics 365 Ledger..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setHandshakeStep(steps[currentStep]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setPayoutSuccess(true);
        setHandshakeStep('');
        
        // Reset success state after a while
        setTimeout(() => setPayoutSuccess(false), 5000);
      }
    }, 1000);
  };

  const efficiencyGainPct = (ROYALTY_METRICS.baselineLaborSalesPct - ROYALTY_METRICS.currentLaborSalesPct).toFixed(1);

  return (
    <div className="flex-1 bg-slate-950 overflow-auto custom-scrollbar font-mono">
      <Header title="Royalty Node Overview" subtitle={`Store #${STORE_NUMBER} • Creator Agreement Active`} />

      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* Success Notification */}
        {payoutSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
             <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
                <div className="bg-white/20 p-1.5 rounded-full">
                   <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest">Payout Authorized</p>
                   <p className="text-[10px] font-mono opacity-80 uppercase">Funds committed to Dynamics 365 Treasury</p>
                </div>
             </div>
          </div>
        )}

        {/* Triple Node: The Core Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Widget 1: The "Efficiency Tracker" */}
           <div className="bg-slate-900 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <Activity className="w-48 h-48 text-emerald-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                       <TrendingUp className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                       <h3 className="text-xs font-black text-white uppercase tracking-widest">Efficiency Tracker</h3>
                       <p className="text-[8px] text-emerald-500/80 font-black uppercase tracking-widest">Live Optimization Delta</p>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <div>
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Efficiency Gain</p>
                          <h2 className="text-4xl font-black text-white">+{efficiencyGainPct}%</h2>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Baseline</p>
                          <p className="text-sm font-black text-slate-400">{ROYALTY_METRICS.baselineLaborSalesPct}%</p>
                       </div>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                       <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${(parseFloat(efficiencyGainPct)/10) * 100}%` }}></div>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed uppercase">
                       Sentinel AI successfully suppressed labor burn against the <span className="text-emerald-400 font-bold">{reg.state} Labor Frame Baseline</span>.
                    </p>
                 </div>
              </div>
           </div>

           {/* Widget 2: The "Royalty Accrual" Meter */}
           <div className="bg-slate-900 rounded-3xl p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <Coins className="w-48 h-48 text-amber-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                       <DollarSign className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                       <h3 className="text-xs font-black text-white uppercase tracking-widest">Royalty Accrual</h3>
                       <p className="text-[8px] text-amber-500/80 font-black uppercase tracking-widest">Creator Value Distribution</p>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Total Royalty Earned</p>
                       <div className="flex items-baseline gap-2">
                          <h2 className="text-4xl font-black text-white transition-all duration-500">${accruedRoyalty.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">Creator Royalty (15%)</span>
                          <span className="text-amber-500 font-mono">Accruing</span>
                       </div>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed uppercase">
                       Calculated from <span className="text-white font-bold">${liveSales.toLocaleString()}</span> in processed session revenue.
                    </p>
                 </div>
              </div>
           </div>

           {/* Widget 3: The "Back-Pay Amortization" Status */}
           <div className={`bg-slate-900 rounded-3xl p-8 border shadow-2xl relative overflow-hidden group transition-all duration-700 ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'border-blue-500/30' : 'border-slate-800'}`}>
              <div className="absolute -right-8 -top-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                 <CalendarDays className="w-48 h-48 text-white" />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                 <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-2xl border transition-colors ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'bg-blue-500/10 border-blue-500/20' : 'bg-slate-800 border-slate-700'}`}>
                       <Landmark className={`w-6 h-6 ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'text-blue-500' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black text-white uppercase tracking-widest">Back-Pay Settlement</h3>
                          <button 
                            onClick={() => setShowAmortizationDetails(!showAmortizationDetails)}
                            className="p-1 hover:bg-white/5 rounded-full transition-colors"
                          >
                            <Info className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                       </div>
                       <p className={`text-[8px] font-black uppercase tracking-widest ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'text-blue-400' : 'text-slate-500'}`}>90-Day Deciphering Period</p>
                    </div>
                 </div>
                 
                 <div className="mb-4">
                    <p className="text-[9px] text-blue-400 font-black uppercase mb-1 flex items-center gap-2">
                       <Clock className="w-3 h-3" /> Nov 1, 2025 - Feb 1, 2026
                    </p>
                 </div>

                 {showAmortizationDetails && (
                    <div className="mb-4 p-3 bg-slate-950 border border-slate-800 rounded-xl animate-in fade-in zoom-in-95 duration-200">
                       <div className="space-y-2">
                          <div className="flex justify-between items-center text-[8px] uppercase font-black">
                             <span className="text-slate-500">Historical Labor %</span>
                             <span className="text-white">{ROYALTY_METRICS.backPayPeriod.historicalLaborPct}%</span>
                          </div>
                          <div className="flex justify-between items-center text-[8px] uppercase font-black">
                             <span className="text-slate-500">Optimized Target</span>
                             <span className="text-emerald-400">{ROYALTY_METRICS.backPayPeriod.optimizedLaborPct}%</span>
                          </div>
                          <div className="flex justify-between items-center text-[8px] uppercase font-black pt-1 border-t border-slate-800">
                             <span className="text-blue-400">Total Sales</span>
                             <span className="text-white">${(ROYALTY_METRICS.backPayPeriod.totalSales / 1000000).toFixed(2)}M</span>
                          </div>
                       </div>
                    </div>
                 )}

                 <div className="flex-1 flex flex-col justify-end">
                    <div>
                       <p className="text-[9px] text-slate-500 uppercase font-black mb-3">Amortization Progress</p>
                       <div className="flex gap-2">
                          {[1, 2, 3].map(month => (
                             <div key={month} className={`h-2 flex-1 rounded-full border transition-all duration-1000 ${month <= ROYALTY_METRICS.backPayMonthsSettled ? 'bg-blue-500 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'bg-slate-950 border-slate-800'}`}></div>
                          ))}
                       </div>
                       <div className="flex justify-between mt-2 font-black text-[9px] uppercase tracking-widest">
                          <span className="text-blue-400">Month {ROYALTY_METRICS.backPayMonthsSettled}</span>
                          <span className="text-slate-600">Month {ROYALTY_METRICS.backPayMonthsTotal}</span>
                       </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${ROYALTY_METRICS.backPayStatus === 'Settled' ? 'text-emerald-500' : 'text-amber-500'}`}>
                            {ROYALTY_METRICS.backPayStatus === 'Settled' ? 'Settled' : 'In Progress'}
                          </span>
                       </div>
                       {ROYALTY_METRICS.backPayStatus === 'Settled' ? (
                          <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase">Licensed Node</div>
                       ) : (
                          <div className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-[8px] font-black text-slate-400 uppercase">Syncing Ledger</div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

        </div>

        {/* Real-time Gain Distribution Visualizer */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                    <Zap className="w-4 h-4 text-[#ff7a59] fill-[#ff7a59]" />
                    Real-time Efficiency Velocity
                 </h3>
                 <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Breeze Ingress Hourly Analysis</p>
              </div>
           </div>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={efficiencyTrend}>
                    <defs>
                       <linearGradient id="gainGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 'bold'}} />
                    <YAxis hide />
                    <Tooltip contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px'}} />
                    <Area type="monotone" dataKey="gain" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#gainGradient)" name="Efficiency Delta (%)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Triple Engine Handshake Notice */}
        <div className="bg-[#0078d4]/5 border border-[#0078d4]/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 text-[#0078d4]" />
           </div>
           <div className="flex items-center gap-6 relative z-10">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl backdrop-blur-md">
                 <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <div className="max-w-xl">
                 <h4 className="text-sm font-black text-white uppercase tracking-widest mb-2">Triple-Engine Immutable Ledger</h4>
                 <p className="text-xs text-slate-400 leading-relaxed font-mono uppercase tracking-tight">
                    Every royalty calculation is verified against <span className="text-blue-400 font-bold">Azure Compute logs</span> and <span className="text-[#ff7a59] font-bold">HubSpot Breeze</span> event streams. All financial records are immutable and synced to <span className="text-emerald-500 font-bold">Dynamics 365 ERP</span>.
                 </p>
              </div>
           </div>
           
           <button 
            onClick={handleRequestPayout}
            disabled={isProcessing}
            className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl relative z-10 flex items-center gap-3 active:scale-95 min-w-[280px] justify-center ${
              isProcessing 
                ? 'bg-slate-800 text-blue-400 cursor-not-allowed border border-blue-500/30' 
                : 'bg-white text-slate-900 hover:bg-slate-100 hover:shadow-white/10 border border-slate-200'
            }`}
           >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">{handshakeStep || 'Processing Handshake...'}</span>
                </>
              ) : (
                <>Request Payout Handshake</>
              )}
           </button>
        </div>

      </div>
    </div>
  );
};

export default RoyaltyDashboard;
