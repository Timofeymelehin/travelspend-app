import React, { useState } from 'react';
import { Trip } from '../types';
import { ChevronDown, Plus, Trash2, Home, Plane, Check, X } from 'lucide-react';

interface HeaderProps {
  currentTrip: Trip;
  trips?: Trip[];
  onSelectTrip?: (id: string) => void;
  onDeleteTrip?: (id: string) => void;
  onOpenCreateTrip?: () => void;
  onAddHomeTrip?: () => void;
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

export const Header: React.FC<HeaderProps> = ({
  currentTrip,
  trips = [],
  onSelectTrip,
  onDeleteTrip,
  onOpenCreateTrip,
  onAddHomeTrip,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const homeTrips = trips.filter((t) => t.tripType === 'home' || t.flag === '🏠');
  const travelTrips = trips.filter((t) => t.tripType !== 'home' && t.flag !== '🏠');

  const handleDelete = (e: React.MouseEvent, trip: Trip) => {
    e.stopPropagation();
    if (!onDeleteTrip) return;
    const isOnlyOne = trips.length <= 1;
    const msg = isOnlyOne
      ? `Удалить «${trip.name}»? Так как это единственная запись, будет создан новый чистый счет повседневных трат.`
      : `Удалить «${trip.name}» со всеми расходами (${trip.items.length} поз.)? Это действие нельзя отменить.`;

    if (window.confirm(msg)) {
      onDeleteTrip(trip.id);
      if (trips.length <= 1) {
        setIsSwitcherOpen(false);
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 sm:py-3 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Trip Title & Destination with click to switch */}
          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-2.5 min-w-0 text-left group hover:opacity-90 transition active:scale-98"
            title="Нажмите, чтобы переключить поездку или выбрать повседневные траты"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-base sm:text-lg shadow-md shadow-rose-950/30 shrink-0">
              {currentTrip.flag || '✈️'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold text-slate-100 truncate tracking-tight group-hover:text-indigo-300 transition">
                  {currentTrip.name}
                </h1>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 shrink-0 transition-transform" />
              </div>
              <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400">
                <span className="truncate">{currentTrip.destination}</span>
                {currentTrip.tripType === 'home' ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                    Дом
                  </span>
                ) : (
                  currentTrip.travelersCount > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                      <span className="shrink-0">{currentTrip.travelersCount} чел.</span>
                    </>
                  )
                )}
              </div>
            </div>
          </button>

          {/* Quick Switch / New Trip button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
            >
              <span className="hidden sm:inline">Счет:</span>
              <span className="font-bold text-indigo-300">
                {currentTrip.tripType === 'home' ? '🏠 Повседневные' : '✈️ Поездка'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Switcher & Manager Modal */}
      {isSwitcherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">
                  🧭
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Выбор счета и поездки</h3>
                  <p className="text-[11px] text-slate-400">Переключайтесь между домом и путешествиями</p>
                </div>
              </div>
              <button
                onClick={() => setIsSwitcherOpen(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content List */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Everyday / Home Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                  <span className="flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    Повседневные траты (Дома)
                  </span>
                  {homeTrips.length === 0 && (
                    <span className="text-[10px] text-amber-400 font-normal">Не настроено</span>
                  )}
                </div>

                {homeTrips.length > 0 ? (
                  <div className="space-y-1.5">
                    {homeTrips.map((t) => {
                      const isSelected = t.id === currentTrip.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => {
                            onSelectTrip?.(t.id);
                            setIsSwitcherOpen(false);
                          }}
                          className={`group p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                            isSelected
                              ? 'bg-indigo-600/25 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xl shrink-0">{t.flag || '🏠'}</span>
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate flex items-center gap-1.5">
                                <span>{t.name}</span>
                                {isSelected && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500 text-white font-normal flex items-center gap-0.5">
                                    <Check className="w-2.5 h-2.5" /> Активно
                                  </span>
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {t.destination} • {t.items.length} трат • {t.baseCurrency}
                              </p>
                            </div>
                          </div>

                          {onDeleteTrip && (
                            <button
                              onClick={(e) => handleDelete(e, t)}
                              className="w-8 h-8 rounded-xl bg-slate-700/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition shrink-0 ml-2"
                              title="Удалить этот счет"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onAddHomeTrip?.();
                      setIsSwitcherOpen(false);
                    }}
                    className="w-full p-3 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-dashed border-indigo-500/50 text-indigo-300 hover:text-white flex items-center justify-center gap-2 text-xs font-bold transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Включить учет повседневных трат (Дом)</span>
                  </button>
                )}
              </div>

              {/* Travel Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                  <span className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5" />
                    Поездки и путешествия
                  </span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {travelTrips.length} шт.
                  </span>
                </div>

                <div className="space-y-1.5">
                  {travelTrips.map((t) => {
                    const isSelected = t.id === currentTrip.id;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectTrip?.(t.id);
                          setIsSwitcherOpen(false);
                        }}
                        className={`group p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                          isSelected
                            ? 'bg-sky-600/20 border-sky-500 text-white shadow-md'
                            : 'bg-slate-800/80 border-slate-750 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-xl shrink-0">{t.flag || '✈️'}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate flex items-center gap-1.5">
                              <span>{t.name}</span>
                              {isSelected && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500 text-white font-normal flex items-center gap-0.5">
                                  <Check className="w-2.5 h-2.5" /> Активно
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate">
                              {t.destination} • {t.localCurrency} ⇄ {t.baseCurrency} • {t.items.length} трат
                            </p>
                          </div>
                        </div>

                        {onDeleteTrip && (
                          <button
                            onClick={(e) => handleDelete(e, t)}
                            className="w-8 h-8 rounded-xl bg-slate-700/50 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition shrink-0 ml-2"
                            title="Удалить эту поездку"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setIsSwitcherOpen(false);
                  onOpenCreateTrip?.();
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950"
              >
                <Plus className="w-4 h-4" />
                <span>Создать поездку / счет</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


