import React, { useState } from 'react';
import { SessionRecord } from '../types';
import { Icons } from './Icon';

interface HistoryLogProps {
  history: SessionRecord[];
  onClear: () => void;
}

const HistoryLog: React.FC<HistoryLogProps> = ({ history, onClear }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClearClick = () => {
    if (isConfirming) {
      onClear();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
      // Reset confirmation state after 3 seconds if not clicked
      setTimeout(() => setIsConfirming(false), 3000);
    }
  };

  return (
    <div className="bg-gaming-800 rounded-2xl border border-gaming-700 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gaming-700 flex justify-between items-center bg-gaming-900/30">
        <div className="flex items-center gap-2 text-white">
          <Icons.History className="text-gaming-accent" size={20} />
          <h2 className="font-bold">سجل الجلسات</h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClearClick}
            className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all duration-200 ${
              isConfirming 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 font-bold' 
                : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
            }`}
          >
            <Icons.Trash size={14} />
            {isConfirming ? 'تأكيد المسح؟' : 'مسح السجل'}
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