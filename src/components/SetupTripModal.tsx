import React, { useState } from 'react';
import { Trip } from '../types';
import { POPULAR_CURRENCIES } from '../data/categories';
import { Sparkles, Home, Plane, ArrowRight } from 'lucide-react';

interface SetupTripModalProps {
  isOpen: boolean;
  onSelectOption: (trip: Trip) => void;
}

export const SetupTripModal: React.FC<SetupTripModalProps> = ({
  isOpen,
  onSelectOption,
}) => {
  const [mode, setMode] = useState<'home' | 'travel' | 'custom'>('home');
  const [homeCity, setHomeCity] = useState('Москва');
  const [homeCurrency, setHomeCurrency] = useState('RUB');
  const [homeMonthlyBudget, setHomeMonthlyBudget] = useState('60000');

  const [travelCountry, setTravelCountry] = useState<'japan' | 'thailand' | 'turkey' | 'dubai' | 'europe'>('japan');

  if (!isOpen) return null;

  const handleCreateHomeTrip = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);

    const newTrip: Trip = {
      id: `trip-home-${Date.now()}`,
      name: `Расходы дома (${homeCity})`,
      destination: `${homeCity}, Россия`,
      flag: '🏠',
      startDate: startOfMonth,
      endDate: endOfMonth,
      baseCurrency: homeCurrency,
      localCurrency: homeCurrency,
      customExchangeRate: 1,
      useManualRate: true,
      totalBudgetBase: parseFloat(homeMonthlyBudget) || 60000,
      travelersCount: 1,
      tripType: 'home',
      items: [],
    };
    onSelectOption(newTrip);
  };

  const handleCreateTravelTrip = () => {
    let newTrip: Trip;
    const now = Date.now();
    const startDate = new Date().toISOString().slice(0, 10);

    if (travelCountry === 'japan') {
      newTrip = {
        id: `trip-${now}`,
        name: 'Поездка в Японию (Токио, Киото)',
        destination: 'Япония 🇯🇵',
        flag: '🇯🇵',
        startDate,
        endDate: new Date(now + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'JPY',
        customExchangeRate: 0.61,
        useManualRate: false,
        totalBudgetBase: 300000,
        travelersCount: 2,
        tripType: 'travel',
        items: [],
      };
    } else if (travelCountry === 'thailand') {
      newTrip = {
        id: `trip-${now}`,
        name: 'Поездка в Таиланд (Пхукет, Бангкок)',
        destination: 'Таиланд 🇹🇭',
        flag: '🇹🇭',
        startDate,
        endDate: new Date(now + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'THB',
        useManualRate: false,
        totalBudgetBase: 250000,
        travelersCount: 2,
        tripType: 'travel',
        items: [],
      };
    } else if (travelCountry === 'turkey') {
      newTrip = {
        id: `trip-${now}`,
        name: 'Поездка в Турцию (Стамбул, Анталья)',
        destination: 'Турция 🇹🇷',
        flag: '🇹🇷',
        startDate,
        endDate: new Date(now + 10 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'TRY',
        useManualRate: false,
        totalBudgetBase: 200000,
        travelersCount: 2,
        tripType: 'travel',
        items: [],
      };
    } else if (travelCountry === 'dubai') {
      newTrip = {
        id: `trip-${now}`,
        name: 'Поездка в ОАЭ (Дубай)',
        destination: 'ОАЭ 🇦🇪',
        flag: '🇦🇪',
        startDate,
        endDate: new Date(now + 7 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'AED',
        useManualRate: false,
        totalBudgetBase: 300000,
        travelersCount: 2,
        tripType: 'travel',
        items: [],
      };
    } else {
      newTrip = {
        id: `trip-${now}`,
        name: 'Евротур (Рим, Париж, Барселона)',
        destination: 'Европа 🇪🇺',
        flag: '🇪🇺',
        startDate,
        endDate: new Date(now + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'EUR',
        useManualRate: false,
        totalBudgetBase: 400000,
        travelersCount: 2,
        tripType: 'travel',
        items: [],
      };
    }
    onSelectOption(newTrip);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-100 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Добро пожаловать!</h2>
          <p className="text-xs text-slate-400">
            Для чего вы хотите вести учет расходов в первую очередь?
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-2xl border border-slate-750">
          <button
            onClick={() => setMode('home')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
              mode === 'home'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Каждый день (Дома)</span>
          </button>
          <button
            onClick={() => setMode('travel')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
              mode === 'travel'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Путешествие</span>
          </button>
        </div>

        {mode === 'home' ? (
          /* Home mode configuration */
          <div className="space-y-3.5 bg-slate-850/60 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                Ваш город проживания
              </label>
              <input
                type="text"
                value={homeCity}
                onChange={(e) => setHomeCity(e.target.value)}
                placeholder="Москва, Санкт-Петербург, Алматы..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-750 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Валюта трат
                </label>
                <select
                  value={homeCurrency}
                  onChange={(e) => setHomeCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-750 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  {POPULAR_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Бюджет на месяц
                </label>
                <input
                  type="number"
                  step="1000"
                  value={homeMonthlyBudget}
                  onChange={(e) => setHomeMonthlyBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-750 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Будут подготовлены ежедневные категории: продукты, жилье и ЖКУ, транспорт, здоровье, кафе, подписки.
            </p>

            <button
              onClick={handleCreateHomeTrip}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40"
            >
              <span>Начать вести учет дома</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Travel mode configuration */
          <div className="space-y-3.5 bg-slate-850/60 p-4 rounded-2xl border border-slate-800">
            <label className="block text-xs font-semibold text-slate-300">
              Куда запланирована поездка?
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {[
                { id: 'japan', flag: '🇯🇵', title: 'Япония', sub: 'JPY ¥ • Токио, Киото' },
                { id: 'thailand', flag: '🇹🇭', title: 'Таиланд', sub: 'THB ฿ • Бангкок, Пхукет' },
                { id: 'turkey', flag: '🇹🇷', title: 'Турция', sub: 'TRY ₺ • Стамбул, Анталья' },
                { id: 'dubai', flag: '🇦🇪', title: 'ОАЭ (Дубай)', sub: 'AED • Дубай, Абу-Даби' },
                { id: 'europe', flag: '🇪🇺', title: 'Европа', sub: 'EUR € • Рим, Париж' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setTravelCountry(p.id as any)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-3 transition ${
                    travelCountry === p.id
                      ? 'bg-indigo-600/25 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-750 text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{p.flag}</span>
                  <div>
                    <div className="text-xs font-bold">{p.title}</div>
                    <div className="text-[11px] text-slate-400">{p.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCreateTravelTrip}
              className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/40"
            >
              <span>Начать поездку</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
