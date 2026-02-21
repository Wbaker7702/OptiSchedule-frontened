
import React from 'react';
import { LayoutDashboard, CalendarDays, Activity, Package, BarChart3, Users, Settings as SettingsIcon, LogOut, ShieldCheck, ArrowLeftRight, Grid3X3, TrendingUp, Coins, Star, Truck, Ghost, Globe, Zap, BookOpen } from 'lucide-react';
import { View } from '../types';
import { APP_VERSION } from '../constants';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Strategic Command', icon: LayoutDashboard },
    { id: View.LOGISTICS, label: 'Logistics Command', icon: Truck },
    { id: View.GHOST_INVENTORY, label: 'Ghost Inventory', icon: Ghost },
    { id: View.ROYALTY_DASHBOARD, label: 'Royalty Node', icon: Coins },
    { id: View.ANALYTICS, label: 'Fiscal Performance', icon: TrendingUp },
    { id: View.STORE_RATINGS, label: 'Store Ratings', icon: Star },
    { id: View.COMPARISON, label: 'Market Comparison', icon: ArrowLeftRight },
    { id: View.METRICS_REPORT, label: 'Deployment Center', icon: Grid3X3 },
    { id: View.OPERATIONS, label: 'Operational Hub', icon: Activity },
    { id: View.INVENTORY, label: 'Asset Management', icon: Package },
    { id: View.TEAM, label: 'Personnel Registry', icon: Users },
    { id: View.PLAYBOOK, label: 'Sentinel Policy', icon: ShieldCheck },
    { id: View.SCHEDULING, label: 'Scheduling Grid', icon: CalendarDays },
    { id: View.SETTINGS, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-white h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 overflow-y-auto custom-scrollbar">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 rounded-lg p-2 shadow-lg shrink-0 border border-blue-400">
             <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm leading-tight text-white tracking-wide">OPTISCHEDULE</h1>
            <p className="text-[9px] text-blue-400 font-mono uppercase tracking-widest">PRO v4.1.0</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 pb-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-500 hover:bg-[#1e293b] hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-4 h-4 ${currentView === item.id ? 'text-white' : 'text-slate-600'}`} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-[#020617]">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-2 text-red-500 hover:text-red-400 w-full rounded-lg hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
