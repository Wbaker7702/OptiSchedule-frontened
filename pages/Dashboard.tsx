
import React from 'react';
import Header from '../components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Line } from 'recharts';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Clock, Store } from 'lucide-react';
import { STORE_PERFORMANCE_DATA, REVENUE_VS_LABOR } from '../constants';
import { View } from '../types';

const Dashboard: React.FC<{ setCurrentView?: (view: View) => void }> = () => {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto custom-scrollbar font-sans text-gray-900">
      <Header title="Dashboard" subtitle="Workforce optimization overview — Feb 15, 2026" />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Labor Efficiency</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">94.2 %</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 2.1%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Shrink Rate</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">1.8 %</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3 mr-1" /> 0.3%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule Adherence</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">91.7 %</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 1.5%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Compliance Risk</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Low</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                 <TrendingDown className="w-3 h-3 mr-1" /> 12%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overtime Hours</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">342 hrs</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingDown className="w-3 h-3 mr-1" /> 8.2%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Active Stores</p>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">47</h2>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3 mr-1" /> 2%
              </span>
            </div>
          </div>

        </div>

        {/* Revenue vs Labor Cost Chart */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900">Revenue vs Labor Cost</h3>
            <p className="text-xs text-gray-500 mt-1">6-month performance trend (in $K)</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_VS_LABOR}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLabor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                  itemStyle={{fontSize: '12px', fontWeight: 'bold'}}
                />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px', fontWeight: '500', paddingTop: '20px'}} />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                <Area type="monotone" dataKey="laborCost" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorLabor)" name="Labor Cost" />
                <Line type="monotone" dataKey="target" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Store Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-sm font-bold text-gray-900">Store Performance</h3>
             <p className="text-xs text-gray-500 mt-1">Real-time KPI breakdown by location</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">Store</th>
                  <th className="px-6 py-4 text-center">Labor Eff.</th>
                  <th className="px-6 py-4 text-center">Shrink</th>
                  <th className="px-6 py-4 text-right">Adherence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {STORE_PERFORMANCE_DATA.map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {store.laborEfficiency}%
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600">
                      {store.shrinkRate}%
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {store.adherence}%
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

export default Dashboard;
