import React, { useState, useEffect } from 'react';
import { ExpenseItem, PaymentMethod } from '../types';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Calendar, MapPin, AlignLeft, Sparkles, Check, Globe } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import {
  COUNTRIES_PRICE_DATA,
  getCurrentTimeOfDay,
  detectCountryCode,
} from '../data/countriesData';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExpenseItem) => void;
  editingItem?: ExpenseItem | null;
  baseCurrency: string;
  localCurrency: string;
  exchangeRate: number; // 1 local = X base
  tripDestination?: string;
  tripFlag?: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  baseCurrency,
  localCurrency,
  exchangeRate,
  tripDestination = '',
  tripFlag = '✈️',
}) => {
  // Determine default country
  const initialCountryCode = detectCountryCode(tripDestination, localCurrency);
  const [selectedCountry, setSelectedCountry] = useState<string>(initialCountryCode);

  const countryInfo = COUNTRIES_PRICE_DATA[selectedCountry] || COUNTRIES_PRICE_DATA.JP;
  const timeOfDay = getCurrentTimeOfDay();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [amountInput, setAmountInput] = useState('');
  const [inputCurrency, setInputCurrency] = useState<'local' | 'base'>('local');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [city, setCity] = useState(countryInfo.defaultCities[0] || 'Токио');
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState('');

  // When modal opens or editing item changes
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setAmountInput(editingItem.amountOriginal.toString());
      setInputCurrency('local');
      setPaymentMethod(editingItem.paymentMethod);
      setDate(editingItem.date);
      setCity(editingItem.locationCity || '');
      setNotes(editingItem.notes || '');
      setPaidBy(editingItem.paidBy || '');
      if (editingItem.countryCode && COUNTRIES_PRICE_DATA[editingItem.countryCode]) {
        setSelectedCountry(editingItem.countryCode);
      }
    } else {
      const defaultC = detectCountryCode(tripDestination, localCurrency);
      setSelectedCountry(defaultC);
      const cInfo = COUNTRIES_PRICE_DATA[defaultC] || COUNTRIES_PRICE_DATA.JP;
      setTitle('');
      setCategory('food');
      setAmountInput('');
      setInputCurrency('local');
      setPaymentMethod('card');
      setDate(new Date().toISOString().slice(0, 10));
      setCity(cInfo.defaultCities[0] || '');
      setNotes('');
      setPaidBy('');
    }
  }, [editingItem, isOpen, tripDestination, localCurrency]);

  if (!isOpen) return null;

  const handleCountryChange = (cCode: string) => {
    setSelectedCountry(cCode);
    const targetC = COUNTRIES_PRICE_DATA[cCode];
    if (targetC && targetC.defaultCities.length > 0) {
      setCity(targetC.defaultCities[0]);
    }
  };

  const numericAmount = parseFloat(amountInput) || 0;

  // Calculate both values based on input currency
  let amountOriginal = 0;
  let amountBase = 0;

  if (inputCurrency === 'local') {
    amountOriginal = numericAmount;
    amountBase = Math.round(numericAmount * exchangeRate * 100) / 100;
  } else {
    amountBase = numericAmount;
    amountOriginal = exchangeRate > 0 ? Math.round(numericAmount / exchangeRate) : 0;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || numericAmount <= 0) return;

    const item: ExpenseItem = {
      id: editingItem ? editingItem.id : `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      category,
      amountOriginal,
      currencyOriginal: localCurrency,
      amountBase,
      date,
      paymentMethod,
      locationCity: city.trim() || undefined,
      countryCode: selectedCountry,
      notes: notes.trim() || undefined,
      paidBy: paidBy.trim() || undefined,
    };

    onSave(item);
    onClose();
  };

  const handleSuggestion = (sug: { title: string; cat: string; amountLocal: number }) => {
    setTitle(sug.title);
    setCategory(sug.cat);
    setAmountInput(sug.amountLocal.toString());
    setInputCurrency('local');
  };

  // Filter or prioritize suggestions matching current time of day
  const suggestions = [...countryInfo.quickSuggestions].sort((a, b) => {
    if (a.timeOfDay === timeOfDay && b.timeOfDay !== timeOfDay) return -1;
    if (b.timeOfDay === timeOfDay && a.timeOfDay !== timeOfDay) return 1;
    return 0;
  });

  const timeLabel = timeOfDay === 'morning' ? 'Утро ☕' : timeOfDay === 'day' ? 'День ☀️' : 'Вечер 🌙';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 sm:rounded-2xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 shrink-0 bg-slate-900/90">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {editingItem ? 'Редактировать расход' : 'Новый расход'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Country Selection Chips */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-semibold">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Страна расхода
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {countryInfo.countryName} ({countryInfo.currencyCode})
              </span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {Object.values(COUNTRIES_PRICE_DATA).map((c) => {
                const isSelected = selectedCountry === c.countryCode;
                return (
                  <button
                    key={c.countryCode}
                    type="button"
                    onClick={() => handleCountryChange(c.countryCode)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700/60'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.countryName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick presets adaptive to country and time */}
          {!editingItem && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Популярные траты для {countryInfo.flag} {countryInfo.countryName}:</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-medium border border-slate-700">
                  {timeLabel}
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestions.map((sug) => (
                  <button
                    key={sug.title}
                    type="button"
                    onClick={() => handleSuggestion(sug)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60 active:scale-95 transition flex items-center gap-1"
                  >
                    <span>{sug.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ~{sug.amountLocal} {countryInfo.currencySymbol}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Название расхода *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Например: Обед в кафе, Метро, Сувениры...`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Amount and Currency Toggle */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>Сумма *</span>
              <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={() => setInputCurrency('local')}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                    inputCurrency === 'local'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  В {localCurrency}
                </button>
                <button
                  type="button"
                  onClick={() => setInputCurrency('base')}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition ${
                    inputCurrency === 'base'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  В {baseCurrency}
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                required
                min="0.01"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0"
                className="w-full px-3.5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-lg font-bold placeholder-slate-500 focus:outline-none focus:border-indigo-500 pr-16"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                {inputCurrency === 'local' ? localCurrency : baseCurrency}
              </span>
            </div>

            {/* Live conversion subtitle */}
            {numericAmount > 0 && (
              <div className="mt-1.5 text-xs text-slate-400 flex items-center justify-between px-1">
                <span>Эквивалент:</span>
                <span className="font-semibold text-indigo-300">
                  {inputCurrency === 'local'
                    ? formatCurrency(amountBase, baseCurrency)
                    : formatCurrency(amountOriginal, localCurrency)}
                </span>
              </div>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Категория
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.values(CATEGORIES).map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition border ${
                      isSelected
                        ? `${cat.bgColor} font-semibold ring-1 ring-white/20`
                        : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-750'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                    >
                      <CategoryIcon categoryId={cat.id} className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Способ оплаты
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'cash', label: 'Наличные 💵' },
                { id: 'card', label: 'Карта 💳' },
                { id: 'transit_card', label: 'Транспортная карта 🚆' },
                { id: 'prepaid', label: 'Онлайн / Бронь 💻' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium text-center border transition ${
                    paymentMethod === pm.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date and City with Quick City Suggestions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Город / Локация
                </label>
              </div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Город..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              {/* Quick city chips for selected country */}
              {countryInfo.defaultCities.length > 0 && (
                <div className="flex gap-1 overflow-x-auto mt-1.5 pb-0.5 scrollbar-none">
                  {countryInfo.defaultCities.map((cName) => (
                    <button
                      key={cName}
                      type="button"
                      onClick={() => setCity(cName)}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition shrink-0 ${
                        city === cName
                          ? 'bg-indigo-600/40 border-indigo-500 text-white'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Заметки (необязательно)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Например: сувениры, чек из кафе, такси до аэропорта..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-sm transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-indigo-950 transition active:scale-98 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {editingItem ? 'Сохранить изменения' : 'Добавить расход'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
