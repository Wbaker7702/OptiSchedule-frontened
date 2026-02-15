
import React from 'react';
import Header from '../components/Header';
import { RefreshCw, Download, Zap } from 'lucide-react';
import { WEEKLY_HEATMAP } from '../constants';

interface SchedulingProps {
  setCurrentView?: any;
  onFinalize?: any;
  activeProvider?: any;
  setActiveProvider?: any;
  isConnected?: any;
  setIsConnected?: any;
  setHubspotStatus?: any;
  heatmapData?: any;
  onAdjustStaffing?: any;
}

const Scheduling: React.FC<SchedulingProps> = () => {

  const getHeatmapColor = (value: number) => {
    if (value >= 10) return 'bg-[#0d9488] text-white'; // Dark Teal
    if (value >= 8) return 'bg-[#14b8a6] text-white'; // Teal
    if (value >= 6) return 'bg-[#5eead4] text-teal-900'; // Light Teal
    if (value >= 4) return 'bg-[#ccfbf1] text-teal-900'; // Very Light Teal
    return 'bg-red-50 text-red-500'; // Understaffed
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto custom-scrollbar font-sans text-gray-900">
      <Header title="Scheduling" subtitle="Workforce scheduling engine & coverage analysis" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-end gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
            <RefreshCw className="w-4 h-4" /> Optimize
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
             <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-[#0f766e] shadow-sm">
             <Zap className="w-4 h-4 fill-white" /> AI Forecast
          </button>
        </div>

        {/* Heatmap Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
           <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900">Staffing Heatmap</h3>
              <p className="text-xs text-gray-500 mt-1">Staff coverage vs. projected demand</p>
              
              <div className="flex gap-4 mt-4 text-[10px] font-medium text-gray-500">
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-50"></div> Understaffed</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#ccfbf1]"></div> Light</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#14b8a6]"></div> Balanced</div>
                 <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-[#0d9488]"></div> Heavy</div>
              </div>
           </div>

           <div className="overflow-x-auto">
             <div className="min-w-[600px]">
               <div className="flex mb-2">
                 <div className="w-16"></div>
                 {['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00'].map(h => (
                   <div key={h} className="flex-1 text-center text-[10px] font-bold text-gray-400">{h}</div>
                 ))}
               </div>
               
               <div className="space-y-2">
                  {WEEKLY_HEATMAP.map((row) => (
                    <div key={row.day} className="flex items-center gap-2">
                       <div className="w-16 text-xs font-medium text-gray-500">{row.day}</div>
                       {row.hours.map((h, i) => (
                          <div key={i} className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold ${getHeatmapColor(h)}`}>
                             {h}
                          </div>
                       ))}
                    </div>
                  ))}
               </div>
             </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-4">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Scheduled Hours</p>
              <h2 className="text-3xl font-bold text-gray-900">2,847</h2>
              <p className="text-xs text-gray-500 mt-1">This week</p>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Coverage Gaps</p>
              <h2 className="text-3xl font-bold text-gray-900">12</h2>
              <p className="text-xs text-gray-500 mt-1">Slots below threshold</p>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Overtime Projected</p>
              <h2 className="text-3xl font-bold text-gray-900">68 hrs</h2>
              <p className="text-xs text-gray-500 mt-1">Across 14 employees</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Scheduling;
