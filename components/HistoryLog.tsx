import React from 'react';
import { SessionRecord } from '../types';
import { Icons } from './Icon';

interface HistoryLogProps {
  history: SessionRecord[];
  onClear: () => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, onClear }) => {
  return (
    <div className="bg-gaming-800 rounded-2xl border border-gaming-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gaming-700 flex justify-between items-center bg-gaming-900/30">
        <div className="flex items-center gap-2 text-white">
          <Icons.History className="text-gaming-accent" size={20} />
          <h2 className="font-bold">سجل الجلسات</h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Icons.Trash size={14} />
            مسح السجل
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
            <Icons.History size={48} className="mb-2" />
            <p>لا توجد جلسات مكتملة اليوم</p>
          </div>
        ) : (
          history.slice().reverse().map((record) => (
            <div key={record.id} className="bg-gaming-900/50 p-3 rounded-xl border border-gaming-700 hover:border-gaming-600 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-sm">{record.screenName}</span>
                <span className="text-gaming-success font-bold font-mono">
                  {record.cost.toFixed(2)} ج.م
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Icons.Clock size={12} />
                  <span>{Math.floor(record.durationMinutes)} دقيقة</span>
                </div>
                <span>{new Date(record.endTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryLog;