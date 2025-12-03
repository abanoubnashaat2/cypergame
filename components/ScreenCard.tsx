import React, { useState, useEffect, useCallback } from 'react';
import { Screen } from '../types';
import { Icons } from './Icon';

interface ScreenCardProps {
  screen: Screen;
  hourlyRate: number;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
}

const ScreenCard: React.FC<ScreenCardProps> = ({ screen, hourlyRate, onStart, onStop }) => {
  const [elapsed, setElapsed] = useState<number>(0);
  const [currentCost, setCurrentCost] = useState<number>(0);

  // Update timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (screen.isActive && screen.startTime) {
      // Update immediately
      const now = Date.now();
      const diff = now - screen.startTime;
      setElapsed(diff);
      
      // Calculate real-time estimated cost
      const hours = diff / (1000 * 60 * 60);
      setCurrentCost(hours * hourlyRate);

      // Set interval for every second
      interval = setInterval(() => {
        const currentNow = Date.now();
        const currentDiff = currentNow - screen.startTime!;
        setElapsed(currentDiff);
        
        const currentHours = currentDiff / (1000 * 60 * 60);
        setCurrentCost(currentHours * hourlyRate);
      }, 1000);
    } else {
      setElapsed(0);
      setCurrentCost(0);
    }

    return () => clearInterval(interval);
  }, [screen.isActive, screen.startTime, hourlyRate]);

  // Format milliseconds to HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 border-2 ${
      screen.isActive 
        ? 'bg-gaming-800 border-gaming-success shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
        : 'bg-gaming-800 border-gaming-700 hover:border-gaming-accent'
    }`}>
      {/* Background Glow Effect */}
      {screen.isActive && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gaming-success blur-3xl opacity-20 rounded-full pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${screen.isActive ? 'bg-gaming-success/20 text-gaming-success' : 'bg-gaming-700 text-gray-400'}`}>
            <Icons.Monitor size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{screen.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${screen.isActive ? 'bg-gaming-success/20 text-gaming-success' : 'bg-gray-700 text-gray-400'}`}>
              {screen.isActive ? 'جاري اللعب' : 'متاح'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Timer Display */}
        <div className="bg-gaming-900/50 rounded-xl p-4 text-center border border-gaming-700/50">
          <div className="text-gray-400 text-xs mb-1">الوقت المنقضي</div>
          <div className="text-3xl font-mono font-bold text-white tracking-wider">
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Cost Display */}
        <div className="flex justify-between items-center bg-gaming-900/50 rounded-xl p-4 border border-gaming-700/50">
          <div className="flex items-center gap-2 text-gray-400">
            <Icons.Banknote size={18} />
            <span className="text-sm">التكلفة الحالية</span>
          </div>
          <div className="text-xl font-bold text-gaming-accent">
            {currentCost.toFixed(2)} <span className="text-xs text-gray-500">ج.م</span>
          </div>
        </div>

        {/* Controls */}
        <div className="pt-2">
          {!screen.isActive ? (
            <button
              onClick={() => onStart(screen.id)}
              className="w-full py-3 bg-gaming-accent hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
            >
              <Icons.Play size={20} fill="currentColor" />
              <span>بدء الجلسة</span>
            </button>
          ) : (
            <button
              onClick={() => onStop(screen.id)}
              className="w-full py-3 bg-gaming-danger hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-500/20"
            >
              <Icons.Stop size={20} fill="currentColor" />
              <span>إنهاء وحساب</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenCard;