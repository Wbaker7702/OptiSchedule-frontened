import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingDown, TrendingUp, Users, Clock, DollarSign, ShieldCheck } from 'lucide-react';

const OVERTIME_DATA = [
  { week: 'Wk 1', hours: 142, cost: 4260 },
  { week: 'Wk 2', hours: 135, cost: 4050 },
  { week: 'Wk 3', hours: 112, cost: 3360 },
  { week: 'Wk 4', hours: 98, cost: 2940 },
  { week: 'Wk 5', hours: 85, cost: 2550 },
  { week: 'Wk 6', hours: 68, cost: 2040 },
];

const COVERAGE_DATA = [
  { week: 'Wk 1', coverage: 82, absenceResolved: 45 },
  { week: 'Wk 2', coverage: 85, absenceResolved: 52 },
  { week: 'Wk 3', coverage: 89, absenceResolved: 68 },
  { week: 'Wk 4', coverage: 92, absenceResolved: 75 },
  { week: 'Wk 5', coverage: 95, absenceResolved: 88 },
  { week: 'Wk 6', coverage: 98, absenceResolved: 94 },
];

const WorkforceImpact: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Labor Cost & Overtime Reduction */}
      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Labor Cost Optimization
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Overtime Spend Reduction Trend</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">-52%</p>
            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Since Sentinel Activation</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={OVERTIME_DATA}>
              <defs>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}}
                itemStyle={{color: '#e2e8f0', fontSize: '12px'}}
              />
              <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" name="Overtime Cost ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-start gap-3">
          <TrendingDown className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Fiscal Impact</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Microsoft Sentinel Optimizer has recaptured <span className="text-white font-bold">$2,220</span> in weekly leakage by reallocating shifts to standard-rate hours.
            </p>
          </div>
        </div>
      </div>

      {/* Coverage & Absence Management */}
      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              Coverage & Resilience
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Shift Fill Rate & Absence Resolution</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-white">98%</p>
            <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Current Coverage</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={COVERAGE_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} domain={[0, 100]} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px'}}
                itemStyle={{color: '#e2e8f0', fontSize: '12px'}}
              />
              <Legend iconSize={8} wrapperStyle={{fontSize: '10px', paddingTop: '10px'}} />
              <Bar dataKey="coverage" name="Shift Coverage %" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absenceResolved" name="Auto-Resolved Absences %" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Resilience Protocol</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              HubSpot Breeze signals now trigger predictive "Flex Shifts," improving absence resolution speed by <span className="text-white font-bold">42%</span>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WorkforceImpact;
