
import React, { useState } from 'react';
import Header from '../components/Header';
import { RefreshCw, Download, Zap, Edit2, AlertCircle, CheckCircle, X, History, User } from 'lucide-react';
import { WEEKLY_HEATMAP, MOCK_SCHEDULE_LOGS, CURRENT_USER } from '../constants';
import { ScheduleLogEntry } from '../types';

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
  const [scheduleData, setScheduleData] = useState(WEEKLY_HEATMAP);
  const [logs, setLogs] = useState<ScheduleLogEntry[]>(MOCK_SCHEDULE_LOGS);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{day: string, hourIndex: number, hourLabel: string, currentValue: number} | null>(null);
  const [modificationType, setModificationType] = useState<'increase' | 'decrease'>('increase');
  const [modificationReason, setModificationReason] = useState('Call-Out Coverage');
  const [modificationNote, setModificationNote] = useState('');

  const hourLabels = ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00'];

  const getHeatmapColor = (value: number) => {
    if (value >= 10) return 'bg-[#0d9488] text-white hover:bg-[#0f766e]'; // Dark Teal
    if (value >= 8) return 'bg-[#14b8a6] text-white hover:bg-[#0d9488]'; // Teal
    if (value >= 6) return 'bg-[#5eead4] text-teal-900 hover:bg-[#2dd4bf]'; // Light Teal
    if (value >= 4) return 'bg-[#ccfbf1] text-teal-900 hover:bg-[#99f6e4]'; // Very Light Teal
    return 'bg-red-50 text-red-500 hover:bg-red-100'; // Understaffed
  };

  const handleCellClick = (day: string, hourIndex: number, currentValue: number) => {
    setSelectedSlot({
      day,
      hourIndex,
      hourLabel: hourLabels[hourIndex],
      currentValue
    });
    setModificationType('increase');
    setModificationReason('Call-Out Coverage');
    setModificationNote('');
    setIsModalOpen(true);
  };

  const handleSaveModification = () => {
    if (!selectedSlot) return;

    // 1. Update Schedule Data
    const newValue = modificationType === 'increase' ? selectedSlot.currentValue + 1 : Math.max(0, selectedSlot.currentValue - 1);
    
    setScheduleData(prev => prev.map(row => {
      if (row.day === selectedSlot.day) {
        const newHours = [...row.hours];
        newHours[selectedSlot.hourIndex] = newValue;
        return { ...row, hours: newHours };
      }
      return row;
    }));

    // 2. Add Audit Log
    const newLog: ScheduleLogEntry = {
      id: `SL-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      manager: CURRENT_USER,
      action: `${modificationType === 'increase' ? 'Added' : 'Removed'} staff for ${selectedSlot.day} @ ${selectedSlot.hourLabel}`,
      reason: modificationReason + (modificationNote ? ` - ${modificationNote}` : ''),
      impact: modificationType === 'increase' ? 'Coverage +1' : 'Efficiency +2%'
    };

    setLogs(prev => [newLog, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto custom-scrollbar font-sans text-gray-900">
      <Header title="Scheduling" subtitle="Workforce scheduling engine & coverage analysis" />

      {/* Adjustment Modal */}
      {isModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100">
            <div className="bg-[#0f172a] p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm uppercase tracking-wider">Modify Schedule</h3>
                  <p className="text-slate-400 text-xs">{selectedSlot.day} @ {selectedSlot.hourLabel}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Current</p>
                  <div className="text-3xl font-black text-gray-900">{selectedSlot.currentValue}</div>
                </div>
                <div className="text-gray-300">→</div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">New Level</p>
                  <div className={`text-3xl font-black ${modificationType === 'increase' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {modificationType === 'increase' ? selectedSlot.currentValue + 1 : Math.max(0, selectedSlot.currentValue - 1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setModificationType('increase')}
                  className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${modificationType === 'increase' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Increase (+1)
                </button>
                <button 
                  onClick={() => setModificationType('decrease')}
                  className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${modificationType === 'decrease' ? 'bg-red-50 border-red-200 text-red-700 ring-2 ring-red-500 ring-offset-1' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Decrease (-1)
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Audit Reason Code</label>
                <select 
                  value={modificationReason}
                  onChange={(e) => setModificationReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm"
                >
                  <option value="Call-Out Coverage">Call-Out Coverage (Sick/Emergency)</option>
                  <option value="Demand Surge">Unplanned Demand Surge</option>
                  <option value="Manager Discretion">Manager Discretion</option>
                  <option value="Low Volume Cut">Low Volume Labor Cut</option>
                  <option value="Training/Shadowing">Training / Shadowing</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
                <input 
                  type="text"
                  value={modificationNote}
                  onChange={(e) => setModificationNote(e.target.value)}
                  placeholder="E.g., Approved by Regional..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-sm font-medium"
                />
              </div>

              <button 
                onClick={handleSaveModification}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

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
           <div className="mb-6 flex justify-between items-end">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Staffing Heatmap</h3>
                <p className="text-xs text-gray-500 mt-1">Staff coverage vs. projected demand. Click any cell to adjust.</p>
              </div>
              <div className="flex gap-4 text-[10px] font-medium text-gray-500">
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
                 {hourLabels.map(h => (
                   <div key={h} className="flex-1 text-center text-[10px] font-bold text-gray-400">{h}</div>
                 ))}
               </div>
               
               <div className="space-y-2">
                  {scheduleData.map((row) => (
                    <div key={row.day} className="flex items-center gap-2">
                       <div className="w-16 text-xs font-medium text-gray-500">{row.day}</div>
                       {row.hours.map((h, i) => (
                          <button 
                            key={i} 
                            onClick={() => handleCellClick(row.day, i, h)}
                            className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-transform active:scale-95 cursor-pointer ${getHeatmapColor(h)}`}
                          >
                             {h}
                          </button>
                       ))}
                    </div>
                  ))}
               </div>
             </div>
           </div>
        </div>

        {/* Audit Trail Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <History className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-900">Schedule Audit Trail</h3>
                <p className="text-xs text-gray-500 mt-0.5">Log of recent manual overrides and adjustments</p>
              </div>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Manager</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Reason Code</th>
                    <th className="px-6 py-4 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="font-medium text-gray-900">{log.manager}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {log.action}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                          {log.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-blue-600 font-bold">
                        {log.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
