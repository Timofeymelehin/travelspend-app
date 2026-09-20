import React from 'react';
import { PieChart, Table, ArrowLeftRight, Settings, Plus } from 'lucide-react';

export type ActiveTab = 'analytics' | 'table' | 'converter' | 'settings';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  itemsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddModal,
  itemsCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/90 pb-safe">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between relative">
        {/* Tab 1: Аналитика */}
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-all ${activeTab === 'analytics' ? 'bg-indigo-500/20' : ''}`}>
            <PieChart className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Аналитика</span>
        </button>

        {/* Tab 2: Таблица расходов */}
        <button
          onClick={() => onTabChange('table')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'table'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-all relative ${activeTab === 'table' ? 'bg-indigo-500/20' : ''}`}>
            <Table className="w-5 h-5" />
            {itemsCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {itemsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Таблица</span>
        </button>

        {/* Center Floating Action Button: + Добавить расход */}
        <div className="flex-none px-2 -mt-5">
          <button
            onClick={onOpenAddModal}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 via-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
            aria-label="Добавить расход"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 3: Конвертер */}
        <button
          onClick={() => onTabChange('converter')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'converter'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-all ${activeTab === 'converter' ? 'bg-indigo-500/20' : ''}`}>
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Конвертер</span>
        </button>

        {/* Tab 4: Настройки / Поездка */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex-1 flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all ${
            activeTab === 'settings'
              ? 'text-indigo-400 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1.5 rounded-full transition-all ${activeTab === 'settings' ? 'bg-indigo-500/20' : ''}`}>
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[11px] tracking-tight">Поездка</span>
        </button>
      </div>
    </div>
  );
};
