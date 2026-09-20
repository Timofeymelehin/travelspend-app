import React from 'react';
import { Trip } from '../types';
import { Wifi, WifiOff, RefreshCw, Smartphone, TrendingUp, Shield, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  currentTrip: Trip;
  isOnline: boolean;
  rateText: string;
  isManualRate: boolean;
  onRefreshRates: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  onInstallPWA?: () => void;
  canInstall?: boolean;
  isPinEnabled?: boolean;
  maskAmounts?: boolean;
  onToggleMask?: () => void;
  onOpenSecurity?: () => void;
  onOpenInstallGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTrip,
  isOnline,
  rateText,
  isManualRate,
  onRefreshRates,
  isRefreshing,
  onOpenSettings,
  onInstallPWA,
  canInstall,
  isPinEnabled,
  maskAmounts,
  onToggleMask,
  onOpenSecurity,
  onOpenInstallGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 py-2.5 sm:py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: App Title & Destination */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-lg sm:text-xl shadow-lg shadow-rose-950/40 shrink-0">
            {currentTrip.flag || '🇯🇵'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-bold text-slate-100 truncate tracking-tight">
                {currentTrip.name}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400">
              <span className="truncate">{currentTrip.destination}</span>
              <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0"></span>
              <span className="shrink-0">{currentTrip.travelersCount} чел.</span>
            </div>
          </div>
        </div>

        {/* Right: Security, Mask, Exchange Rate & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Privacy Eye Toggle */}
          {onToggleMask && (
            <button
              onClick={onToggleMask}
              title={maskAmounts ? 'Показать суммы трат' : 'Скрыть суммы (режим защиты от чужих глаз)'}
              className={`p-2 rounded-xl border transition ${
                maskAmounts
                  ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              {maskAmounts ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          )}

          {/* Security PIN Button */}
          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              title={isPinEnabled ? 'PIN-защита активна' : 'Настроить защиту паролем/PIN'}
              className={`p-2 rounded-xl border transition ${
                isPinEnabled
                  ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-400 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          )}

          {/* Rate Badge */}
          <button
            onClick={onOpenSettings}
            title={isManualRate ? 'Ручной курс' : 'Автоматический курс'}
            className="hidden xs:flex sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/60 text-xs text-slate-200 hover:bg-slate-750 transition"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-mono font-medium text-[11px] sm:text-xs">{rateText}</span>
            {isManualRate && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Ручной курс" />
            )}
          </button>

          {/* Online/Offline status & rate refresh */}
          <button
            onClick={onRefreshRates}
            disabled={isRefreshing}
            title={isOnline ? 'Онлайн: нажать для обновления курса' : 'Офлайн: используются сохраненные курсы'}
            className={`p-2 rounded-xl border transition ${
              isOnline
                ? 'bg-slate-800/70 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}
          >
            {isRefreshing ? (
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-indigo-400" />
            ) : isOnline ? (
              <Wifi className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            )}
          </button>

          {/* Install on Phone / Android Button */}
          <button
            onClick={canInstall ? onInstallPWA : onOpenInstallGuide}
            title="Установить приложение на телефон"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-900/30 transition active:scale-95"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">На телефон</span>
          </button>
        </div>
      </div>
    </header>
  );
};
