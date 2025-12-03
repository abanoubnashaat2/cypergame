import React from 'react';
import { Stats } from '../types';
import { Icons } from './Icon';

interface StatsHeaderProps {
  stats: Stats;
  activeScreensCount: number;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ stats, activeScreensCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-indigo-900 to-gaming-800 p-6 rounded-2xl border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 p-4 opacity-10">
          <Icons.Banknote size={100} />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">إجمالي الإيرادات اليوم</p>
          <h2 className="text-4xl font-bold text-white flex items-baseline gap-2">
            {stats.totalRevenue.toFixed(2)}
            <span className="text-lg text-indigo-300 font-normal">ج.م</span>
          </h2>
        </div>
      </div>

      {/* Sessions Count Card */}
      <div className="bg-gaming-800 p-6 rounded-2xl border border-gaming-700 shadow-lg flex items-center gap-4">
        <div className="p-4 bg-blue-500/20 rounded-xl text-blue-400">
          <Icons.History size={32} />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium">عدد الجلسات المكتملة</p>
          <h2 className="text-3xl font-bold text-white">{stats.totalSessions}</h2>
        </div>
      </div>

      {/* Active Screens Card */}
      <div className="bg-gaming-800 p-6 rounded-2xl border border-gaming-700 shadow-lg flex items-center gap-4">
        <div className={`p-4 rounded-xl ${activeScreensCount > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/20 text-gray-500'}`}>
          <Icons.Monitor size={32} />
        </div>
        <div>
          <p className="text-gray-400 text-sm font-medium">الشاشات النشطة</p>
          <h2 className="text-3xl font-bold text-white">{activeScreensCount} <span className="text-lg text-gray-500 font-normal">/ 3</span></h2>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;