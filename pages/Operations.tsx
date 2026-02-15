
import React from 'react';
import Header from '../components/Header';
import { AUDIT_LOGS_MOCK } from '../constants';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react';

interface OperationsProps {
  defaultTab?: any;
  externalTrigger?: any;
  onClearTrigger?: any;
}

const Operations: React.FC<OperationsProps> = () => {
  const passedCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Passed').length;
  const warningCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Warning').length;
  const failedCount = AUDIT_LOGS_MOCK.filter(l => l.status === 'Failed').length;

  return (
    <div className="flex-1 bg-gray-50 overflow-auto custom-scrollbar font-sans text-gray-900">
      <Header title="Operations" subtitle="Audit tracking & compliance management" />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Status Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg">
               <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-gray-900">{passedCount + 28}</h3>
               <p className="text-xs text-gray-500">Passed this month</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg">
               <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-gray-900">{warningCount + 6}</h3>
               <p className="text-xs text-gray-500">Warnings this month</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
               <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
               <h3 className="text-2xl font-bold text-gray-900">{failedCount + 2}</h3>
               <p className="text-xs text-gray-500">Failed this month</p>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-sm font-bold text-gray-900">Audit & Compliance Log</h3>
             <p className="text-xs text-gray-500 mt-1">Recent inspection results across all stores</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Store</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {AUDIT_LOGS_MOCK.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {log.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {log.date}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {log.store}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {log.type}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                        log.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 
                        log.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 
                        'bg-red-50 text-red-600'
                      }`}>
                        {log.status}
                      </span>
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

export default Operations;
