import React, { useState, useRef } from 'react';
import { Trip, Currency } from '../../types';
import { POPULAR_CURRENCIES } from '../../data/categories';
import { exportExpensesToCSV, parseCSVToExpenses } from '../../utils/csvHelper';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_JAPAN_TRIP } from '../../data/sampleJapanTrip';
import { checkForAppUpdates } from '../../services/updateService';
import {
  Compass,
  FileSpreadsheet,
  Upload,
  RotateCcw,
  Users,
  Wallet,
  Calendar,
  Sparkles,
  Plus,
  Check,
  AlertTriangle,
  HardDrive,
  RefreshCw,
  Shield,
  Smartphone,
  KeyRound,
  Trash2,
  Home,
} from 'lucide-react';

interface TripsSettingsViewProps {
  currentTrip: Trip;
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onUpdateTrip: (updated: Trip) => void;
  onCreateTrip: (newTrip: Trip) => void;
  onResetToJapanPreset: () => void;
  onClearAllExpenses?: () => void;
  onRefreshRates: () => void;
  isRefreshingRates: boolean;
  ratesLastUpdated: string;
  isPinEnabled?: boolean;
  onOpenSecurity?: () => void;
  onOpenInstallGuide?: () => void;
}

export const TripsSettingsView: React.FC<TripsSettingsViewProps> = ({
  currentTrip,
  trips,
  onSelectTrip,
  onUpdateTrip,
  onCreateTrip,
  onResetToJapanPreset,
  onClearAllExpenses,
  onRefreshRates,
  isRefreshingRates,
  ratesLastUpdated,
  isPinEnabled,
  onOpenSecurity,
  onOpenInstallGuide,
}) => {
  const [name, setName] = useState(currentTrip.name);
  const [destination, setDestination] = useState(currentTrip.destination);
  const [flag, setFlag] = useState(currentTrip.flag || '🇯🇵');
  const [baseCurrency, setBaseCurrency] = useState(currentTrip.baseCurrency);
  const [localCurrency, setLocalCurrency] = useState(currentTrip.localCurrency);
  const [totalBudget, setTotalBudget] = useState(currentTrip.totalBudgetBase.toString());
  const [travelersCount, setTravelersCount] = useState(currentTrip.travelersCount.toString());
  const [startDate, setStartDate] = useState(currentTrip.startDate);
  const [endDate, setEndDate] = useState(currentTrip.endDate);

  // Sync internal form state when active trip changes
  React.useEffect(() => {
    setName(currentTrip.name);
    setDestination(currentTrip.destination);
    setFlag(currentTrip.flag || '✈️');
    setBaseCurrency(currentTrip.baseCurrency);
    setLocalCurrency(currentTrip.localCurrency);
    setTotalBudget(currentTrip.totalBudgetBase.toString());
    setTravelersCount(currentTrip.travelersCount.toString());
    setStartDate(currentTrip.startDate);
    setEndDate(currentTrip.endDate);
  }, [currentTrip.id]);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTripDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Trip = {
      ...currentTrip,
      name: name.trim() || currentTrip.name,
      destination: destination.trim() || currentTrip.destination,
      flag: flag.trim() || '✈️',
      baseCurrency,
      localCurrency,
      totalBudgetBase: parseFloat(totalBudget) || 0,
      travelersCount: Math.max(parseInt(travelersCount, 10) || 1, 1),
      startDate,
      endDate,
    };
    onUpdateTrip(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseCSVToExpenses(text, currentTrip.localCurrency, currentTrip.baseCurrency);
        if (parsed.length > 0) {
          const completeItems = parsed.map((p, idx) => ({
            id: p.id || `imp-${Date.now()}-${idx}`,
            title: p.title || 'Импортированный расход',
            category: p.category || 'misc',
            amountOriginal: p.amountOriginal || 0,
            currencyOriginal: currentTrip.localCurrency,
            amountBase: p.amountBase || 0,
            date: p.date || new Date().toISOString().slice(0, 10),
            paymentMethod: p.paymentMethod || 'card',
            locationCity: p.locationCity,
            notes: p.notes,
          }));

          const updated: Trip = {
            ...currentTrip,
            items: [...currentTrip.items, ...completeItems],
          };
          onUpdateTrip(updated);
          alert(`Успешно импортировано ${completeItems.length} позиций в текущую поездку!`);
        } else {
          alert('Не удалось распознать строки расходов из CSV файла.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCreateNewTrip = (preset: 'home' | 'japan' | 'thailand' | 'turkey' | 'dubai' | 'europe' | 'custom') => {
    let newTrip: Trip;

    if (preset === 'home') {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().slice(0, 10);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().slice(0, 10);
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Расходы дома (каждый день)',
        destination: 'Россия (Дом) 🇷🇺',
        flag: '🏠',
        startDate: startOfMonth,
        endDate: endOfMonth,
        baseCurrency: 'RUB',
        localCurrency: 'RUB',
        customExchangeRate: 1,
        useManualRate: true,
        totalBudgetBase: 60000,
        travelersCount: 1,
        tripType: 'home',
        items: [],
      };
    } else if (preset === 'japan') {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Поездка в Японию (Токио, Киото)',
        destination: 'Япония 🇯🇵',
        flag: '🇯🇵',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'JPY',
        customExchangeRate: 0.61,
        useManualRate: false,
        totalBudgetBase: 300000,
        travelersCount: 2,
        items: [],
      };
    } else if (preset === 'thailand') {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Поездка в Таиланд (Бангкок, Пхукет)',
        destination: 'Таиланд 🇹🇭',
        flag: '🇹🇭',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'THB',
        useManualRate: false,
        totalBudgetBase: 250000,
        travelersCount: 2,
        items: [],
      };
    } else if (preset === 'turkey') {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Поездка в Турцию (Стамбул, Анталья)',
        destination: 'Турция 🇹🇷',
        flag: '🇹🇷',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'TRY',
        useManualRate: false,
        totalBudgetBase: 200000,
        travelersCount: 2,
        items: [],
      };
    } else if (preset === 'dubai') {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Поездка в ОАЭ (Дубай)',
        destination: 'ОАЭ 🇦🇪',
        flag: '🇦🇪',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'AED',
        useManualRate: false,
        totalBudgetBase: 300000,
        travelersCount: 2,
        items: [],
      };
    } else if (preset === 'europe') {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Евротур (Рим, Париж, Барселона)',
        destination: 'Европа 🇪🇺',
        flag: '🇪🇺',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'EUR',
        useManualRate: false,
        totalBudgetBase: 400000,
        travelersCount: 2,
        items: [],
      };
    } else {
      newTrip = {
        id: `trip-${Date.now()}`,
        name: 'Новое путешествие',
        destination: 'Куда едем? 🌍',
        flag: '✈️',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
        baseCurrency: 'RUB',
        localCurrency: 'USD',
        useManualRate: false,
        totalBudgetBase: 200000,
        travelersCount: 1,
        items: [],
      };
    }

    onCreateTrip(newTrip);
    setShowNewTripModal(false);
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn max-w-2xl mx-auto">
      {/* 1. Trip Switcher Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            Ваши поездки ({trips.length})
          </h2>
          <button
            onClick={() => setShowNewTripModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-95 shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Создать поездку</span>
          </button>
        </div>

        {/* Trips list chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {trips.map((t) => {
            const isSelected = t.id === currentTrip.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTrip(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs font-semibold shrink-0 transition ${
                  isSelected
                    ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700/70 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-base">{t.flag || '✈️'}</span>
                <div className="text-left">
                  <p className="truncate max-w-[140px]">{t.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {t.localCurrency} ⇄ {t.baseCurrency}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Edit Current Trip Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Настройки текущей поездки</span>
            </h3>
            <p className="text-xs text-slate-400">
              Валюта, общий лимит бюджета и количество участников
            </p>
          </div>
          {isSavedNotice && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
              <Check className="w-3.5 h-3.5" /> Сохранено!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveTripDetails} className="space-y-4">
          {/* Trip Name & Flag */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Название таблицы / поездки
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Флаг / Эмодзи
              </label>
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-center text-base focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Currencies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Местная валюта страны (траты)
              </label>
              <select
                value={localCurrency}
                onChange={(e) => setLocalCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {POPULAR_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Базовая валюта (для аналитики)
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {POPULAR_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} — {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Travelers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                Общий запланированный бюджет ({baseCurrency})
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                Количество человек (для расчета на 1 чел.)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={travelersCount}
                onChange={(e) => setTravelersCount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Дата начала поездки
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Дата окончания поездки
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition active:scale-98 shadow-md shadow-indigo-950"
          >
            Сохранить параметры поездки
          </button>
        </form>
      </div>

      {/* 3. CSV Import & Export / Excel Compatibility */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          Работа с таблицами (CSV / Excel / Google Sheets)
        </h3>
        <p className="text-xs text-slate-400">
          Вы можете скачать текущую таблицу расходов в формате CSV (совместим с Excel и Google Таблицами) или загрузить свои данные.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => exportExpensesToCSV(currentTrip.items, currentTrip.name, currentTrip.baseCurrency, currentTrip.localCurrency)}
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Экспорт таблицы в CSV</span>
          </button>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition active:scale-98"
            >
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Импорт из CSV файла</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Security & Protection Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Защита и безопасность приложения
          </h3>
          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              isPinEnabled
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {isPinEnabled ? 'PIN включен' : 'Без защиты'}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Защитите финансовые данные поездки от посторонних: 4-значный цифровой PIN-код, автоблокировка при сворачивании и режим скрытия сумм (маскировка баланса в людных местах).
        </p>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {isPinEnabled ? 'PIN-код защищает запуск приложения' : 'Рекомендуется включить код безопасности'}
          </div>
          <button
            onClick={onOpenSecurity}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isPinEnabled ? 'Настроить защиту' : 'Установить PIN'}</span>
          </button>
        </div>
      </div>

      {/* 5. Mobile App Installation Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            Установка на Android и iPhone
          </h3>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            PWA Standalone
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Приложение можно добавить на домашний экран Android или iOS как полноценную программу: работает без адресной строки браузера, сохраняет все данные оффлайн и загружается мгновенно.
        </p>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Инструкция по установке в 2 клика:
          </div>
          <button
            onClick={onOpenInstallGuide}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 text-xs font-bold transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span>Инструкция по установке</span>
          </button>
        </div>
      </div>

      {/* 6. Offline System & Reset Preset */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-sky-400" />
            Офлайн-хранилище и данные
          </h3>
          <button
            onClick={onRefreshRates}
            disabled={isRefreshingRates}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? 'animate-spin' : ''}`} />
            <span>Обновить курсы</span>
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Все ваши расходы и курсы надежно кэшируются на устройстве. Приложение работает автономно в самолете и роуминге без интернета.
        </p>

        <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-xs text-slate-400">
            Очистить все расходы текущей поездки ({currentTrip.items.length} поз.):
          </div>
          {onClearAllExpenses && (
            <button
              onClick={() => {
                if (window.confirm(`Удалить все расходы (${currentTrip.items.length} поз.) в поездке «${currentTrip.name}»? Приложение станет чистым.`)) {
                  onClearAllExpenses();
                }
              }}
              disabled={currentTrip.items.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 disabled:opacity-50 text-slate-300 border border-slate-750 text-xs font-semibold transition active:scale-95 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Очистить все расходы</span>
            </button>
          )}
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Загрузить демонстрационный образец «Затраты в Японии»:
          </div>
          <button
            onClick={() => {
              if (window.confirm('Загрузить готовую демонстрационную таблицу расходов в Японии?')) {
                onResetToJapanPreset();
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/40 text-indigo-300 border border-indigo-800/50 text-xs font-semibold transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Загрузить демо Японии</span>
          </button>
        </div>
      </div>

      {/* 7. App Updates (GitHub Releases) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Обновление приложения
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              v1.2.0
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
              GitHub OTA
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Проверьте наличие новой версии приложения на GitHub. При обновлении все ваши старые данные (траты, настройки, история) сохраняются автоматически.
        </p>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Установка свежего APK в один клик:
          </div>
          <button
            onClick={() => checkForAppUpdates(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Проверить обновления</span>
          </button>
        </div>
      </div>

      {/* New Trip Modal */}
      {showNewTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100 space-y-4">
            <h3 className="text-base font-bold text-white">Создать новую поездку</h3>
            <p className="text-xs text-slate-400">
              Выберите готовый шаблон страны с настроенной валютой или создайте свой маршрут:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <button
                onClick={() => handleCreateNewTrip('home')}
                className="w-full p-2.5 rounded-2xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🏠</span>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Расходы дома (каждый день)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">Дом</span>
                  </h4>
                  <p className="text-[11px] text-indigo-300">Продукты, жилье, авто, кафе, здоровье</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('japan')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🇯🇵</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Япония (JPY ¥)</h4>
                  <p className="text-[11px] text-slate-400">Токио, Киото, Осака</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('thailand')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🇹🇭</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Таиланд (THB ฿)</h4>
                  <p className="text-[11px] text-slate-400">Бангкок, Пхукет, острова</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('turkey')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🇹🇷</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Турция (TRY ₺)</h4>
                  <p className="text-[11px] text-slate-400">Стамбул, Анталья, Каппадокия</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('dubai')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🇦🇪</span>
                <div>
                  <h4 className="text-xs font-bold text-white">ОАЭ (AED)</h4>
                  <p className="text-[11px] text-slate-400">Дубай, Абу-Даби</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('europe')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🇪🇺</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Евротур (EUR €)</h4>
                  <p className="text-[11px] text-slate-400">Рим, Париж, Барселона</p>
                </div>
              </button>

              <button
                onClick={() => handleCreateNewTrip('custom')}
                className="w-full p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-750 flex items-center gap-3 text-left transition"
              >
                <span className="text-2xl">🌍</span>
                <div>
                  <h4 className="text-xs font-bold text-white">Любая другая страна</h4>
                  <p className="text-[11px] text-slate-400">Свободный выбор валюты и бюджета</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowNewTripModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs transition"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
