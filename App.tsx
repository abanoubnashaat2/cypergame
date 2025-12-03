import React, { useState, useEffect } from 'react';
import { Screen, SessionRecord, Stats } from './types';
import ScreenCard from './components/ScreenCard';
import HistoryLog from './components/HistoryLog';
import StatsHeader from './components/StatsHeader';
import { Icons } from './components/Icon';
import ImageEditor from './components/ImageEditor';

const INITIAL_SCREENS: Screen[] = [
  { id: 1, name: 'شاشة 1 (PS5)', isActive: false, startTime: null },
  { id: 2, name: 'شاشة 2 (PS5)', isActive: false, startTime: null },
  { id: 3, name: 'شاشة 3 (PS4)', isActive: false, startTime: null },
];

const App: React.FC = () => {
  // --- State ---
  const [screens, setScreens] = useState<Screen[]>(INITIAL_SCREENS);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [hourlyRate, setHourlyRate] = useState<number>(50); // Default 50 EGP
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

  // --- Logic ---

  // Load from local storage on mount (optional persistance)
  useEffect(() => {
    const savedRate = localStorage.getItem('ps_hourly_rate');
    if (savedRate) setHourlyRate(Number(savedRate));
    
    // We generally don't persist active sessions simply in this demo to avoid complex date sync issues
    // but we could store history
    const savedHistory = localStorage.getItem('ps_history');
    if (savedHistory) {
        try {
            setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to parse history");
        }
    }
  }, []);

  // Save changes to local storage
  useEffect(() => {
    localStorage.setItem('ps_hourly_rate', hourlyRate.toString());
  }, [hourlyRate]);

  useEffect(() => {
    localStorage.setItem('ps_history', JSON.stringify(history));
  }, [history]);

  const handleStartSession = (id: number) => {
    setScreens(prev => prev.map(screen => {
      if (screen.id === id) {
        return { ...screen, isActive: true, startTime: Date.now() };
      }
      return screen;
    }));
  };

  const handleStopSession = (id: number) => {
    setScreens(prev => prev.map(screen => {
      if (screen.id === id && screen.startTime) {
        const endTime = Date.now();
        const durationMs = endTime - screen.startTime;
        const durationMinutes = durationMs / (1000 * 60);
        const durationHours = durationMs / (1000 * 60 * 60);
        
        // Calculate cost: Minimum charge logic could go here, for now linear
        let cost = durationHours * hourlyRate;
        
        // Optional: Round to nearest 0.5 or integer if needed
        // cost = Math.ceil(cost); 

        const newRecord: SessionRecord = {
          id: `${id}-${Date.now()}`,
          screenName: screen.name,
          startTime: screen.startTime,
          endTime,
          durationMinutes,
          cost
        };

        setHistory(current => [...current, newRecord]);

        return { ...screen, isActive: false, startTime: null };
      }
      return screen;
    }));
  };

  const handleClearHistory = () => {
    // Confirmation is now handled inside the HistoryLog component for better UX
    setHistory([]);
  };

  // --- Derived State ---
  const stats: Stats = {
    totalSessions: history.length,
    totalRevenue: history.reduce((acc, curr) => acc + curr.cost, 0)
  };

  const activeScreensCount = screens.filter(s => s.isActive).length;

  return (
    <div className="min-h-screen bg-gaming-900 text-gray-100 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-gaming-800 border-b border-gaming-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gaming-accent p-2 rounded-lg">
              <Icons.Monitor className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-wide">PS Manager <span className="text-gaming-accent">Pro</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
             {/* Hourly Rate Control (Inline) */}
            <div className="hidden md:flex items-center gap-2 bg-gaming-900 px-3 py-1.5 rounded-lg border border-gaming-700">
               <span className="text-gray-400 text-sm">سعر الساعة:</span>
               <input 
                 type="number" 
                 value={hourlyRate}
                 onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                 className="bg-transparent text-white font-bold w-16 text-center focus:outline-none focus:border-b border-gaming-accent"
               />
               <span className="text-xs text-gray-500">ج.م</span>
            </div>

            {/* AI Image Editor Button */}
            <button
              onClick={() => setIsEditorOpen(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-500/20 transition-all transform hover:scale-105"
            >
              <Icons.Wand size={18} />
              <span>محرر الصور</span>
            </button>
            <button
              onClick={() => setIsEditorOpen(true)}
              className="md:hidden p-2 text-purple-400 hover:text-white"
            >
              <Icons.Wand size={24} />
            </button>

            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <Icons.Settings size={24} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Settings Drawer (Simple implementation) */}
      {isSettingsOpen && (
        <div className="md:hidden bg-gaming-800 p-4 border-b border-gaming-700 mb-4 animate-in slide-in-from-top-2">
            <label className="block text-sm text-gray-400 mb-2">سعر الساعة (ج.م)</label>
            <input 
                 type="number" 
                 value={hourlyRate}
                 onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                 className="w-full bg-gaming-900 border border-gaming-700 rounded-lg p-2 text-white"
               />
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        
        <StatsHeader stats={stats} activeScreensCount={activeScreensCount} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Screens Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {screens.map(screen => (
              <ScreenCard 
                key={screen.id} 
                screen={screen} 
                hourlyRate={hourlyRate}
                onStart={handleStartSession}
                onStop={handleStopSession}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 h-[600px] sticky top-24">
            <HistoryLog history={history} onClear={handleClearHistory} />
          </div>
        
        </div>
      </main>

      {/* AI Image Editor Modal */}
      {isEditorOpen && (
        <ImageEditor onClose={() => setIsEditorOpen(false)} />
      )}
    </div>
  );
};

export default App;