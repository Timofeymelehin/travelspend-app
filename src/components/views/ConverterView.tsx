import React, { useState } from 'react';
import { Trip } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  ArrowLeftRight,
  Percent,
  TrendingUp,
  Sparkles,
  Globe,
  Sun,
  Moon,
  Coffee,
} from 'lucide-react';
import {
  COUNTRIES_PRICE_DATA,
  getCurrentTimeOfDay,
  detectCountryCode,
} from '../../data/countriesData';

interface ConverterViewProps {
  trip: Trip;
  exchangeRate: number; // 1 local = X base (e.g. 1 JPY = 0.61 RUB)
  onUpdateManualRate: (newRate: number, useManual: boolean) => void;
  isOnline: boolean;
  ratesLastUpdated: string;
}

export const ConverterView: React.FC<ConverterViewProps> = ({
  trip,
  exchangeRate,
  onUpdateManualRate,
  isOnline,
  ratesLastUpdated,
}) => {
  const [inputAmount, setInputAmount] = useState('1000');
  const [direction, setDirection] = useState<'localToBase' | 'baseToLocal'>('localToBase');
  const [taxFreeMode, setTaxFreeMode] = useState<'none' | 'minus10' | 'plus10'>('none');
  const [manualRateInput, setManualRateInput] = useState(
    trip.customExchangeRate ? (trip.customExchangeRate * 100).toFixed(2) : (exchangeRate * 100).toFixed(2)
  );
  const [isManualActive, setIsManualActive] = useState(trip.useManualRate);

  // Active country for cheat sheet prices
  const initialCountry = detectCountryCode(trip.destination, trip.localCurrency);
  const [activeCountryCode, setActiveCountryCode] = useState<string>(initialCountry);

  // Time-adaptive filter ('auto', 'morning', 'day', 'night', 'all')
  const currentTime = getCurrentTimeOfDay();
  const [timeFilter, setTimeFilter] = useState<'auto' | 'morning' | 'day' | 'night' | 'all'>('auto');

  const effectiveTimeOfDay = timeFilter === 'auto' ? currentTime : timeFilter;

  const currentCountry = COUNTRIES_PRICE_DATA[activeCountryCode] || COUNTRIES_PRICE_DATA.JP;

  const numVal = parseFloat(inputAmount) || 0;

  // Handle Tax-Free adjustments
  let adjustedNumVal = numVal;
  if (taxFreeMode === 'minus10') {
    // Price includes 10% tax, deduct tax: price / 1.10
    adjustedNumVal = numVal / 1.1;
  } else if (taxFreeMode === 'plus10') {
    // Price excludes tax, add 10%: price * 1.10
    adjustedNumVal = numVal * 1.1;
  }

  // Conversion result
  let convertedAmount = 0;
  if (direction === 'localToBase') {
    convertedAmount = adjustedNumVal * exchangeRate;
  } else {
    convertedAmount = exchangeRate > 0 ? adjustedNumVal / exchangeRate : 0;
  }

  const handleToggleDirection = () => {
    setDirection((prev) => (prev === 'localToBase' ? 'baseToLocal' : 'localToBase'));
  };

  const handleSaveRate = () => {
    const val = parseFloat(manualRateInput);
    if (!isNaN(val) && val > 0) {
      const perUnitRate = val / 100;
      onUpdateManualRate(perUnitRate, true);
      setIsManualActive(true);
    }
  };

  const handleResetRate = () => {
    onUpdateManualRate(exchangeRate, false);
    setIsManualActive(false);
    setManualRateInput((exchangeRate * 100).toFixed(2));
  };

  // Filter cheat sheet items according to timeOfDay
  const filteredCheatSheet = currentCountry.cheatSheet.filter((item) => {
    if (effectiveTimeOfDay === 'all') return true;
    if (!item.timeOfDay || item.timeOfDay === 'all') return true;
    return item.timeOfDay === effectiveTimeOfDay;
  });

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 1. Main Currency Converter Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Калькулятор и конвертер валюты</span>
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isManualActive ? 'bg-amber-400' : isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            {isManualActive ? 'Фиксированный курс' : isOnline ? 'Онлайн-курс' : 'Офлайн режим'}
          </span>
        </div>

        {/* Input and Result Box */}
        <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-3">
          {/* Source Input */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{direction === 'localToBase' ? `Сумма (${trip.localCurrency})` : `Сумма (${trip.baseCurrency})`}</span>
              <span className="text-[11px] text-slate-500">
                {direction === 'localToBase' ? currentCountry.countryName : 'Ваша валюта'}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                step="any"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white focus:outline-none tracking-tight pr-14"
              />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-400">
                {direction === 'localToBase' ? trip.localCurrency : trip.baseCurrency}
              </span>
            </div>
          </div>

          {/* Swap Button & Divider */}
          <div className="flex items-center justify-center -my-1">
            <button
              onClick={handleToggleDirection}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 shadow-md active:scale-95 transition"
              title="Поменять направление конвертации"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Converted Result */}
          <div>
            <div className="text-xs text-slate-400 mb-1">
              {direction === 'localToBase' ? `Эквивалент (${trip.baseCurrency})` : `Эквивалент (${trip.localCurrency})`}
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
                {direction === 'localToBase'
                  ? formatCurrency(convertedAmount, trip.baseCurrency)
                  : formatCurrency(convertedAmount, trip.localCurrency)}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {direction === 'localToBase' ? trip.baseCurrency : trip.localCurrency}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Denomination Quick-Keys */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] shrink-0 mr-1">Быстро:</span>
          {[100, 500, 1000, 5000, 10000, 50000].map((val) => (
            <button
              key={val}
              onClick={() => {
                setInputAmount(val.toString());
                setDirection('localToBase');
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono font-medium shrink-0 border border-slate-750 transition active:scale-95"
            >
              {val.toLocaleString('ru-RU')}
            </button>
          ))}
        </div>

        {/* Tax-Free Toggle Buttons */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span>Tax-Free (10% налог):</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTaxFreeMode('none')}
              className={`px-2 py-1 rounded-lg transition ${
                taxFreeMode === 'none' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Без изменений
            </button>
            <button
              onClick={() => setTaxFreeMode('minus10')}
              className={`px-2 py-1 rounded-lg transition ${
                taxFreeMode === 'minus10'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Вычесть 10% налога из цены"
            >
              -10% (Без налога)
            </button>
            <button
              onClick={() => setTaxFreeMode('plus10')}
              className={`px-2 py-1 rounded-lg transition ${
                taxFreeMode === 'plus10' ? 'bg-rose-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
              title="Добавить 10% налога к цене"
            >
              +10% (С налогом)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Custom Exchange Rate Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Курс обмена валюты
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            100 {trip.localCurrency} = {(exchangeRate * 100).toFixed(2)} {trip.baseCurrency}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
              100 {trip.localCurrency} =
            </span>
            <input
              type="number"
              step="0.01"
              value={manualRateInput}
              onChange={(e) => setManualRateInput(e.target.value)}
              className="w-full pl-28 pr-12 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">
              {trip.baseCurrency}
            </span>
          </div>
          <button
            onClick={handleSaveRate}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95 shrink-0"
          >
            Применить
          </button>
          {isManualActive && (
            <button
              onClick={handleResetRate}
              className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition active:scale-95 shrink-0"
              title="Сбросить на онлайн-курс"
            >
              Сброс
            </button>
          )}
        </div>
      </div>

      {/* 3. Country Price Cheat Sheet (Adaptive by Country and Time of Day) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Шпаргалка цен по странам (Ориентиры)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Нажмите на строку, чтобы мгновенно подставить цену в калькулятор
            </p>
          </div>

          {/* Time of day filter chips */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] self-start sm:self-auto">
            <button
              onClick={() => setTimeFilter('auto')}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                timeFilter === 'auto' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Авто-время</span>
              <span className="text-[10px] opacity-75">
                ({currentTime === 'morning' ? 'Утро' : currentTime === 'day' ? 'День' : 'Вечер'})
              </span>
            </button>
            <button
              onClick={() => setTimeFilter('morning')}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                timeFilter === 'morning' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coffee className="w-3 h-3" />
              <span>Утро</span>
            </button>
            <button
              onClick={() => setTimeFilter('day')}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                timeFilter === 'day' ? 'bg-amber-500 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-3 h-3" />
              <span>День</span>
            </button>
            <button
              onClick={() => setTimeFilter('night')}
              className={`px-2 py-1 rounded-lg transition flex items-center gap-1 ${
                timeFilter === 'night' ? 'bg-indigo-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3 h-3" />
              <span>Вечер</span>
            </button>
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-2 py-1 rounded-lg transition ${
                timeFilter === 'all' ? 'bg-slate-700 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Все
            </button>
          </div>
        </div>

        {/* Country Selector Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {Object.values(COUNTRIES_PRICE_DATA).map((c) => {
            const isSelected = activeCountryCode === c.countryCode;
            return (
              <button
                key={c.countryCode}
                onClick={() => setActiveCountryCode(c.countryCode)}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-1 ring-white/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700/60'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.countryName}</span>
              </button>
            );
          })}
        </div>

        {/* Cheat Sheet Price List */}
        <div className="divide-y divide-slate-800/80 pt-1">
          {filteredCheatSheet.length > 0 ? (
            filteredCheatSheet.map((entry) => {
              // Convert local price of this country into user's base currency using proportional exchange
              const approxBase = entry.priceLocal * exchangeRate;
              return (
                <button
                  key={entry.item}
                  onClick={() => {
                    setInputAmount(entry.priceLocal.toString());
                    setDirection('localToBase');
                  }}
                  className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 rounded-xl px-2 transition group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base">{entry.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate block">
                        {entry.item}
                      </span>
                      {entry.timeOfDay && entry.timeOfDay !== 'all' && (
                        <span className="text-[10px] text-slate-500">
                          {entry.timeOfDay === 'morning' ? 'Завтрак / утро' : entry.timeOfDay === 'day' ? 'Обед / день' : 'Ужин / вечер'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-bold text-white">
                      {currentCountry.currencySymbol}
                      {entry.priceLocal.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-[11px] text-indigo-300 font-mono ml-2">
                      (~{formatCurrency(approxBase, trip.baseCurrency)})
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              Нет позиций для выбранного фильтра времени. Выберите "Все" или другое время.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
