import React, { useState } from 'react';
import { Trip, Currency } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { POPULAR_CURRENCIES } from '../../data/categories';
import {
  ArrowLeftRight,
  Percent,
  TrendingUp,
  HelpCircle,
  Sparkles,
  DollarSign,
  Tag,
  ShoppingBag,
} from 'lucide-react';

interface ConverterViewProps {
  trip: Trip;
  exchangeRate: number; // 1 local = X base (e.g. 1 JPY = 0.61 RUB)
  onUpdateManualRate: (newRate: number, useManual: boolean) => void;
  isOnline: boolean;
  ratesLastUpdated: string;
}

const JAPAN_PRICE_CHEAT_SHEET = [
  { item: 'Вода / Зеленый чай в автомате', yen: 140, icon: '🥤' },
  { item: 'Онигири с лососем в 7-Eleven', yen: 180, icon: '🍙' },
  { item: 'Тамаго-сэндвич в Lawson', yen: 260, icon: '🥪' },
  { item: 'Тарелка тонкоцу-рамэна (Ichiran)', yen: 1100, icon: '🍜' },
  { item: 'Сет суси на обед (конвейер)', yen: 1800, icon: '🍣' },
  { item: 'Поездка на метро по Токио', yen: 220, icon: '🚇' },
  { item: 'Порог для возврата Tax-Free (10%)', yen: 5500, icon: '🏷️' },
  { item: 'Синкансэн Токио — Киото (Nozomi)', yen: 14200, icon: '🚄' },
  { item: 'Бизнес-отель 3★ за ночь', yen: 12000, icon: '🏨' },
];

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

  // Keypad click handler
  const handleKeypad = (val: string) => {
    if (val === 'C') {
      setInputAmount('0');
    } else if (val === '⌫') {
      setInputAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
    } else if (val === '.') {
      if (!inputAmount.includes('.')) {
        setInputAmount((prev) => prev + '.');
      }
    } else {
      setInputAmount((prev) => (prev === '0' ? val : prev + val));
    }
  };

  const handleSaveRate = () => {
    const ratePer100 = parseFloat(manualRateInput) || 0;
    if (ratePer100 > 0) {
      const ratePer1 = ratePer100 / 100;
      onUpdateManualRate(ratePer1, isManualActive);
    }
  };

  const handleToggleManual = () => {
    const nextState = !isManualActive;
    setIsManualActive(nextState);
    const ratePer100 = parseFloat(manualRateInput) || 0;
    onUpdateManualRate(ratePer100 > 0 ? ratePer100 / 100 : exchangeRate, nextState);
  };

  const sourceCurrency = direction === 'localToBase' ? trip.localCurrency : trip.baseCurrency;
  const targetCurrency = direction === 'localToBase' ? trip.baseCurrency : trip.localCurrency;

  return (
    <div className="space-y-4 pb-24 animate-fadeIn max-w-xl mx-auto">
      {/* 1. Main Converter Display Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Курс: 100 {trip.localCurrency} = {(exchangeRate * 100).toFixed(2)} {trip.baseCurrency}
          </span>
          <span className="text-[11px] text-slate-500">
            {isManualActive ? 'Ручной курс' : ratesLastUpdated}
          </span>
        </div>

        {/* Input Value Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
              Вы вводите ({sourceCurrency})
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight truncate">
              {formatCurrency(numVal, sourceCurrency)}
            </div>
          </div>
          {/* Swap Direction Button */}
          <button
            onClick={() => setDirection(direction === 'localToBase' ? 'baseToLocal' : 'localToBase')}
            className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-white border border-slate-700 flex items-center justify-center transition active:scale-90 shrink-0"
            title="Поменять валюты местами"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </button>
        </div>

        {/* Result Value Box */}
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-4">
          <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-0.5">
            Результат ({targetCurrency})
          </div>
          <div className="text-3xl sm:text-4xl font-black text-indigo-200 font-mono tracking-tight truncate">
            {formatCurrency(convertedAmount, targetCurrency)}
          </div>
          {taxFreeMode !== 'none' && (
            <div className="text-xs text-amber-300 mt-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span>
                {taxFreeMode === 'minus10'
                  ? 'С учетом скидки Tax-Free 10% (без налога)'
                  : 'С учетом налога +10%'}
              </span>
            </div>
          )}
        </div>

        {/* Japan Tax-Free 10% Toggle Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              Калькулятор Tax-Free в Японии (10%):
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => setTaxFreeMode('none')}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition border ${
                taxFreeMode === 'none'
                  ? 'bg-slate-800 border-indigo-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Обычная цена
            </button>
            <button
              onClick={() => setTaxFreeMode('minus10')}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition border ${
                taxFreeMode === 'minus10'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              -10% Tax-Free
            </button>
            <button
              onClick={() => setTaxFreeMode('plus10')}
              className={`py-1.5 px-2 rounded-xl text-xs font-medium transition border ${
                taxFreeMode === 'plus10'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              +10% Налог
            </button>
          </div>
        </div>

        {/* Quick Price Buttons */}
        <div>
          <div className="text-xs text-slate-400 mb-1.5">Быстрые суммы:</div>
          <div className="grid grid-cols-4 gap-1.5">
            {[500, 1000, 3000, 5500, 10000, 20000, 30000, 50000].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setInputAmount(val.toString());
                  setDirection('localToBase');
                }}
                className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700/60 text-slate-200 text-xs font-mono font-medium text-center active:scale-95 transition"
              >
                ¥{val.toLocaleString('ru-RU')}
              </button>
            ))}
          </div>
        </div>

        {/* Tactile Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
            <button
              key={key}
              onClick={() => handleKeypad(key)}
              className={`py-3 rounded-2xl text-base font-bold transition active:scale-95 flex items-center justify-center font-mono ${
                key === 'C'
                  ? 'bg-rose-950/40 text-rose-400 border border-rose-800/50 hover:bg-rose-900/50'
                  : key === '⌫'
                  ? 'bg-slate-800 text-indigo-300 border border-slate-700 hover:bg-slate-750'
                  : 'bg-slate-800/80 text-white border border-slate-700/60 hover:bg-slate-750'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Custom Exchange Rate Settings Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Настройка обменного курса
          </h3>
          <button
            onClick={handleToggleManual}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              isManualActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {isManualActive ? 'Ручной курс вкл' : 'Авто курс онлайн'}
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Если вы меняли наличные в банке или аэропорту по своему курсу, задайте его здесь, чтобы все расчеты в приложении велись строго по вашему реальному курсу.
        </p>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* 3. Japan Travel Price Cheat Sheet */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Шпаргалка цен в Японии (Ориентиры)
        </h3>
        <p className="text-xs text-slate-400">
          Нажмите на любую позицию, чтобы быстро подставить цену в калькулятор:
        </p>
        <div className="divide-y divide-slate-800/80">
          {JAPAN_PRICE_CHEAT_SHEET.map((entry) => {
            const approxBase = entry.yen * exchangeRate;
            return (
              <button
                key={entry.item}
                onClick={() => {
                  setInputAmount(entry.yen.toString());
                  setDirection('localToBase');
                }}
                className="w-full py-2.5 flex items-center justify-between text-left hover:bg-slate-800/40 rounded-xl px-2 transition group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-base">{entry.icon}</span>
                  <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate">
                    {entry.item}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-white">
                    ¥{entry.yen.toLocaleString('ru-RU')}
                  </span>
                  <span className="text-[11px] text-indigo-300 font-mono ml-2">
                    (~{formatCurrency(approxBase, trip.baseCurrency)})
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
