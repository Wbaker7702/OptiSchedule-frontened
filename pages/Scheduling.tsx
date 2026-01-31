
import React, { useState } from 'react';
import Header from '../components/Header';
import { HEATMAP_DATA } from '../constants';
import { Calendar, Download, Printer, Filter, RefreshCw, Link as LinkIcon, Check, X, ShieldCheck, Settings, Database, Users as UsersIcon, List, ArrowLeftRight, Activity, Globe, Loader2, Server, Layers, Hexagon } from 'lucide-react';
import { View } from '../types';

interface SchedulingProps {
  setCurrentView?: (view: View) => void;
  onFinalize?: () => void;
}

type ERPProvider = 'Dynamics 365' | 'SAP S/4HANA' | 'FDE';

const Scheduling: React.FC<SchedulingProps> = ({ setCurrentView, onFinalize }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeProvider, setActiveProvider] = useState<ERPProvider>('Dynamics 365'); // Connected provider
  const [selectedProvider, setSelectedProvider] = useState<ERPProvider>('Dynamics 365'); // Form selection
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [activeTab, setActiveTab] = useState<'heatmap' | 'logs'>('heatmap');
  
  // Form State
  const [environmentUrl, setEnvironmentUrl] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [apiKey, setApiKey] = useState('');
  
  const [syncConfig, setSyncConfig] = useState({
    employees: true,
    shifts: true,
    timeOff: true,
    performance: false
  });

  const syncLogs = [
    { event: 'Fetch Personnel Assets', target: activeProvider === 'SAP S/4HANA' ? 'SAP HCM' : activeProvider === 'FDE' ? 'FDE Gateway' : 'Finance & Ops', status: 'Success', time: '06:00 AM' },
    { event: 'Pipeline Sync', target: activeProvider === 'SAP S/4HANA' ? 'SAP Sales Cloud' : activeProvider === 'FDE' ? 'FDE Ledger' : 'Dynamics 365 Sales', status: 'Success', time: '06:05 AM' },
    { event: 'ERP Resource Audit', target: 'Sentinel Node', status: 'Pending', time: 'Now' },
    { event: 'Inventory Allocation', target: 'Supply Chain Hub', status: 'Failed', time: 'Yesterday' }
  ];

  // Helper to generate current week dates
  const getDaysOfWeek = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(today.setDate(diff));

    for (let i = 0; i < 6; i++) { // Mon to Sat
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        dates.push({
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })
        });
    }
    return dates;
  };

  const weekDates = getDaysOfWeek();

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const handleFinalize = () => {
    setIsFinalizing(true);
    setTimeout(() => {
        setIsFinalizing(false);
        if (onFinalize) {
            onFinalize();
        }
    }, 1500);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    setIsModalOpen(false);
    setActiveProvider(selectedProvider);
    setTimeout(() => {
        isConnected ? null : setIsConnected(true);
        setIsSyncing(false);
    }, 1500);
  };

  const toggleConfig = (key: keyof typeof syncConfig) => {
    setSyncConfig(prev => ({...prev, [key]: !prev[key]}));
  };

  const renderProviderIcon = (provider: ERPProvider, className = "w-6 h-6") => {
      if (provider === 'SAP S/4HANA') return <Server className={className} />;
      if (provider === 'FDE') return <Layers className={className} />;
      return <Database className={className} />;
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-auto relative text-gray-900">
      <Header title="Scheduling Center" subtitle="Optimize workforce allocation based on customer flow patterns" />
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all scale-100 border border-gray-100 text-slate-900">
                <div className="bg-[#002050] p-6 flex items-center justify-between">
                    <h3 className="text-white font-bold text-xl flex items-center gap-2">
                        {renderProviderIcon(selectedProvider, "w-6 h-6 text-blue-400")}
                        {isConnected ? `${activeProvider} Settings` : 'Connect Enterprise ERP'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8">
                    {!isConnected && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                            {(['Dynamics 365', 'SAP S/4HANA', 'FDE'] as ERPProvider[]).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setSelectedProvider(p)}
                                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                                        selectedProvider === p 
                                        ? 'bg-white text-blue-900 shadow-sm' 
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                >
                                    {p.replace('Dynamics ', 'D').replace('S/4HANA', 'HANA')}
                                </button>
                            ))}
                        </div>
                    )}

                    <p className="text-slate-700 text-sm mb-6 text-center leading-relaxed font-semibold">
                        {isConnected 
                          ? `Modify your ${activeProvider} environment settings below. Changes are enforced via the Sentinel Protocol.`
                          : `Connect your ${selectedProvider} environment to synchronize enterprise resource planning and workforce deployment.`}
                    </p>

                    <form onSubmit={handleConnect} className="space-y-5">
                        {selectedProvider === 'Dynamics 365' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Environment URL</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="https://org.crm.dynamics.com"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Tenant ID (Azure AD)</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={tenantId}
                                            onChange={(e) => setTenantId(e.target.value)}
                                            placeholder="00000000-0000-0000-0000-000000000000"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedProvider === 'SAP S/4HANA' && (
                            <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">S/4HANA API Endpoint</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="https://api.s4hana.ondemand.com"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Client ID</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sb-clone-..."
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Hexagon className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {selectedProvider === 'FDE' && (
                             <>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">FDE Gateway Host</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={environmentUrl}
                                            onChange={(e) => setEnvironmentUrl(e.target.value)}
                                            placeholder="gateway.fde-enterprise.net"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <Globe className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest mb-2">Access Key</label>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="••••••••••••••••"
                                            className="w-full pl-4 pr-10 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all placeholder-slate-400 bg-white font-mono text-sm text-slate-900 font-bold"
                                            required={!isConnected}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                            <ShieldCheck className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="space-y-3 pt-2">
                            <label className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">Enterprise Sync Scopes</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { key: 'employees', label: 'HR Profiles', icon: UsersIcon },
                                    { key: 'shifts', label: 'Shift Logic', icon: Calendar },
                                    { key: 'timeOff', label: 'Payroll Data', icon: Calendar },
                                    { key: 'performance', label: 'ERP KPIs', icon: Settings }
                                ].map((item) => (
                                    <div 
                                        key={item.key}
                                        onClick={() => toggleConfig(item.key as keyof typeof syncConfig)}
                                        className={`cursor-pointer p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                                            syncConfig[item.key as keyof typeof syncConfig] 
                                            ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm' 
                                            : 'border-slate-100 hover:border-slate-200 text-slate-500'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                                            syncConfig[item.key as keyof typeof syncConfig]
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'bg-white border-slate-200'
                                        }`}>
                                            {syncConfig[item.key as keyof typeof syncConfig] && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-wider">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                className="w-full py-4 bg-[#002050] hover:bg-[#003070] text-white font-black text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-blue-900/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isConnected ? 'Update ERP Logic' : `Authorize ${selectedProvider} Node`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
      )}

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* ERP Integration Status */}
        {!isConnected ? (
             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/5 to-blue-600/20 rounded-full -mr-16 -mt-16 pointer-events-none transition-transform group-hover:scale-110 duration-700 blur-3xl"></div>
                <div className="flex items-center gap-6 z-10 relative">
                   <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-600/20 shadow-sm shrink-0">
                      <Database className="w-10 h-10 text-blue-600" />
                   </div>
                   <div className="max-w-xl">
                     <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight">Enterprise Resource Planning (ERP)</h3>
                     <p className="text-gray-600 leading-relaxed text-sm font-medium">
                        To enforce the Sentinel "Zone Defense" protocol, integrate a certified ERP environment. Supported protocols include <span className="text-blue-700 font-bold">Dynamics 365</span>, <span className="text-blue-700 font-bold">SAP S/4HANA</span>, and <span className="text-blue-700 font-bold">FDE</span>.
                     </p>
                   </div>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-[#002050] hover:bg-[#003070] text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl z-10 whitespace-nowrap"
                >
                   <LinkIcon className="w-5 h-5" />
                   Initialize ERP Node
                </button>
             </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col lg:flex-row items-center justify-between bg-gradient-to-r from-white via-blue-50/20 to-blue-50/40 gap-6">
               <div className="flex items-center gap-5 w-full lg:w-auto">
                  <div className="relative shrink-0">
                      <div className="w-14 h-14 bg-[#002050] rounded-xl flex items-center justify-center text-white shadow-lg ring-4 ring-white">
                         {renderProviderIcon(activeProvider, "w-8 h-8")}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-[3px] border-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                          <Check className="w-3.5 h-3.5 text-white" />
                      </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-3 uppercase tracking-tight">
                        {activeProvider} Node Online
                    </h3>
                    <p className="text-xs text-slate-700 font-mono font-black uppercase tracking-widest">Environment: <span className="text-blue-700">PRODUCTION-SECURE</span> • Tenant: <span className="text-blue-700 font-mono">{activeProvider === 'SAP S/4HANA' ? 'S4-HANA-5065' : activeProvider === 'FDE' ? 'FDE-NODE-1' : 'D365-CORE-5065'}</span></p>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
                   <button 
                       onClick={() => setIsModalOpen(true)}
                       className="flex items-center gap-2 px-4 py-2.5 text-slate-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                   >
                       <Settings className="w-4 h-4" />
                       Mapping
                   </button>
                   <button 
                       onClick={handleSync}
                       disabled={isSyncing}
                       className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-slate-800 hover:bg-gray-50 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm ${isSyncing ? 'opacity-70 cursor-wait' : ''}`}
                   >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-600' : ''}`} />
                      {isSyncing ? 'Syncing...' : `Force ${activeProvider} Refresh`}
                   </button>
               </div>
            </div>
        )}

        {/* Dynamic Content Area */}
        <div className="space-y-6">
           <div className="flex items-center gap-4 border-b border-gray-200 pb-1">
              <button 
                onClick={() => setActiveTab('heatmap')}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'heatmap' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Activity className="w-4 h-4" />
                {activeProvider === 'FDE' ? 'FDE Volume Heatmap' : activeProvider === 'SAP S/4HANA' ? 'S/4HANA Resource Map' : 'Dynamics Pulse Heatmap'}
                {activeTab === 'heatmap' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
              <button 
                onClick={() => setActiveTab('logs')}
                className={`flex items-center gap-2 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors relative ${activeTab === 'logs' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <List className="w-4 h-4" />
                ERP Transaction Log
                {activeTab === 'logs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
           </div>

           {activeTab === 'heatmap' ? (
              <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                   <div>
                      <h2 className="text-lg font-black text-white uppercase tracking-wider">Resource Allocation Variance</h2>
                      <p className="text-blue-400 text-xs font-mono font-bold mt-1 uppercase tracking-widest">
                          "{activeProvider === 'SAP S/4HANA' ? 'S/4HANA Consumption Analysis' : 'ERP Pipeline Ingress Analysis'}"
                      </p>
                   </div>
                </div>
                
                <div className="p-6 overflow-x-auto">
                  <div className="min-w-[800px]">
                    <div className="grid grid-cols-[150px_repeat(10,1fr)]">
                      <div className="flex flex-col justify-center space-y-16 text-slate-400 font-black text-[10px] uppercase tracking-widest pr-4 border-r border-slate-700">
                        <div className="h-24 flex items-center justify-end">Pipeline Volume</div>
                        <div className="h-24 flex items-center justify-end">Floor Deployment</div>
                      </div>

                      {HEATMAP_DATA.map((point, index) => {
                         let topColorClass = "bg-blue-600";
                         if(point.efficiency > 80) topColorClass = "bg-red-700";
                         else if(point.efficiency > 60) topColorClass = "bg-orange-500";
                         
                         return (
                          <div key={index} className="flex flex-col">
                            <div className={`h-24 ${topColorClass} border-r border-slate-800/20 flex items-center justify-center text-white font-black text-lg`}>
                               {point.transactionVolume}
                            </div>
                            <div className={`h-24 bg-blue-900/50 border-r border-slate-800/20 border-t border-white/20 flex items-center justify-center text-white font-black text-lg`}>
                              {point.staffing}
                            </div>
                            <div className="mt-4 text-center text-slate-500 text-[10px] font-black uppercase tracking-widest">{point.hour}</div>
                          </div>
                         );
                      })}
                    </div>
                  </div>
                </div>
              </div>
           ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-gray-900">
                 <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 text-xs uppercase tracking-widest">{activeProvider} Data Bridge Log</h3>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       Bridge Secure
                    </span>
                 </div>
                 <div className="divide-y divide-gray-100 font-mono">
                    {syncLogs.map((log, i) => (
                      <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                             log.status === 'Success' ? 'bg-blue-50 text-blue-600' : 
                             log.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                           }`}>
                             <ArrowLeftRight className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-gray-900 uppercase tracking-wider">{log.event}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Source: {log.target}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                             log.status === 'Success' ? 'bg-blue-100 text-blue-700' : 
                             log.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                           }`}>
                             {log.status}
                           </span>
                           <p className="text-[10px] text-gray-400 mt-1 font-bold">{log.time}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           )}
        </div>

        {/* Weekly Schedule Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-gray-900">
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
             <div className="flex items-center gap-4">
                <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">Workforce Deployment Ledger</h3>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button className="px-3 py-1 bg-white shadow-sm rounded-md text-[10px] font-black uppercase tracking-widest text-blue-800">Grid View</button>
                    <button className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600">Timeline</button>
                </div>
             </div>
             <div className="flex gap-2">
                 <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                     <Filter className="w-4 h-4" />
                 </button>
                 <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                     <Printer className="w-4 h-4" />
                 </button>
                 <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                     <Download className="w-4 h-4" />
                 </button>
             </div>
           </div>

           <div className="overflow-x-auto">
             <div className="min-w-[1000px] border border-gray-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-[200px_repeat(6,1fr)] bg-gray-50 border-b border-gray-200">
                    <div className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-widest border-r border-gray-200">
                        Department / Shift
                    </div>
                    {weekDates.map((date, i) => (
                        <div key={i} className="p-4 text-center border-r border-gray-200 last:border-0">
                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{date.day}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{date.date}</p>
                        </div>
                    ))}
                </div>
                {/* Rows */}
                {['Front End', 'Grocery', 'Electronics', 'Apparel', 'Pharmacy'].map((dept, i) => (
                    <div key={dept} className="grid grid-cols-[200px_repeat(6,1fr)] border-b border-gray-200 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <div className="p-4 border-r border-gray-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-900">{dept}</span>
                            <span className="text-[9px] font-mono text-gray-400">08:00 - 22:00</span>
                        </div>
                        {weekDates.map((_, j) => (
                            <div key={j} className="p-2 border-r border-gray-200 last:border-0 relative group cursor-pointer hover:bg-blue-50 transition-colors">
                                {Math.random() > 0.3 ? (
                                    <div className={`w-full h-full rounded-lg p-2 flex flex-col justify-center border ${
                                        Math.random() > 0.7 
                                        ? 'bg-amber-100 border-amber-200 text-amber-800' 
                                        : 'bg-blue-100 border-blue-200 text-blue-800'
                                    }`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1">
                                            {Math.random() > 0.5 ? 'Morning' : 'Closing'}
                                        </p>
                                        <p className="text-[10px] font-bold">
                                            {Math.floor(Math.random() * 4 + 2)} Staff
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <div className="w-0.5 h-3 bg-gray-400 absolute"></div>
                                            <div className="w-3 h-0.5 bg-gray-400 absolute"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
             </div>
           </div>

           <div className="mt-6 flex justify-end">
               <button 
                onClick={handleFinalize}
                disabled={!isConnected || isFinalizing}
                className="px-8 py-4 bg-[#002050] hover:bg-[#003070] text-white rounded-xl shadow-lg shadow-blue-900/20 text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                   {isFinalizing ? (
                       <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating Schedule...
                       </>
                   ) : (
                       <>
                        <ShieldCheck className="w-4 h-4" />
                        Finalize & Publish
                       </>
                   )}
               </button>
           </div>

        </div>

      </div>
    </div>
  );
};

export default Scheduling;
