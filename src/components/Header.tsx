import React from 'react';
import { Trip } from '../types';

interface HeaderProps {
  currentTrip: Trip;
  isOnline?: boolean;
  rateText?: string;
  isManualRate?: boolean;
  onRefreshRates?: () => void;
  isRefreshing?: boolean;
  onOpenSettings?: () => void;
  onInstallPWA?: () => void;
  canInstall?: boolean;
  isPinEnabled?: boolean;
  maskAmounts?: boolean;
  onToggleMask?: () => void;
  onOpenSecurity?: () => void;
  onOpenInstallGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTrip }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 sm:py-3 shadow-sm">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Trip Title & Destination */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-base sm:text-lg shadow-md shadow-rose-950/30 shrink-0">
            {currentTrip.flag || '✈️'}
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-100 truncate tracking-tight">
              {currentTrip.name}
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
              <span className="truncate">{currentTrip.destination}</span>
              {currentTrip.travelersCount > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                  <span className="shrink-0">{currentTrip.travelersCount} чел.</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

