import React, { useState, useEffect } from 'react';
import { ExpenseItem, PaymentMethod } from '../types';
import { CATEGORIES } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { X, Calendar, MapPin, AlignLeft, Sparkles, Check } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExpenseItem) => void;
  editingItem?: ExpenseItem | null;
  baseCurrency: string;
  localCurrency: string;
  exchangeRate: number; // 1 local = X base
}

const QUICK_SUGGESTIONS = [
  { title: 'Рамэн', cat: 'food', defaultYen: 1200 },
  { title: 'Пополнение карты Suica', cat: 'transport_local', defaultYen: 3000 },
  { title: 'Онигири и кофе в 7-Eleven', cat: 'food', defaultYen: 650 },
  { title: 'Билеты в метро', cat: 'transport_local', defaultYen: 350 },
  { title: 'Автомат Jihanki (напиток)', cat: 'misc', defaultYen: 160 },
  { title: 'Сувениры Don Quijote', cat: 'shopping', defaultYen: 5500 },
  { title: 'Ужин в Идзакае', cat: 'food', defaultYen: 4500 },
  { title: 'Входной билет в храм', cat: 'sightseeing', defaultYen: 600 },
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingItem,
  baseCurrency,
  localCurrency,
  exchangeRate,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [amountInput, setAmountInput] = useState('');
  const [inputCurrency, setInputCurrency] = useState<'local' | 'base'>('local');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [city, setCity] = useState('Токио');
  const [notes, setNotes] = useState('');
  const [paidBy, setPaidBy] = useState('');

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setCategory(editingItem.category);
      setAmountInput(editingItem.amountOriginal.toString());
      setInputCurrency('local');
      setPaymentMethod(editingItem.paymentMethod);
      setDate(editingItem.date);
      setCity(editingItem.locationCity || 'Токио');
      setNotes(editingItem.notes || '');
      setPaidBy(editingItem.paidBy || '');
    } else {
      setTitle('');
      setCategory('food');
      setAmountInput('');
      setInputCurrency('local');
      setPaymentMethod('card');
      setDate(new Date().toISOString().slice(0, 10));
      setCity('Токио');
      setNotes('');
      setPaidBy('');
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

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
      notes: notes.trim() || undefined,
      paidBy: paidBy.trim() || undefined,
    };

    onSave(item);
    onClose();
  };

  const handleSuggestion = (sug: typeof QUICK_SUGGESTIONS[0]) => {
    setTitle(sug.title);
    setCategory(sug.cat);
    setAmountInput(sug.defaultYen.toString());
    setInputCurrency('local');
  };

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
          {/* Quick presets for Japan trips */}
          {!editingItem && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Быстрый выбор типичных трат:</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.title}
                    type="button"
                    onClick={() => handleSuggestion(sug)}
                    className="shrink-0 px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/60 active:scale-95 transition"
                  >
                    {sug.title}
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
              placeholder="Например: Рамэн в Итиран, Синкансэн, Отель..."
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
                { id: 'cash', label: 'Наличные 💴' },
                { id: 'card', label: 'Карта 💳' },
                { id: 'transit_card', label: 'Suica/IC 🚆' },
                { id: 'prepaid', label: 'Онлайн 💻' },
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

          {/* Date and City */}
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
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Город / Локация
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Токио, Киото, Осака..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
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
              placeholder="Например: Tax-Free 10%, ужин с друзьями, билеты на 17:00"
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
