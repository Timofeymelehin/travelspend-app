import React, { useState, useMemo } from 'react';
import { Trip, ExpenseItem } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon, PaymentMethodBadge } from '../CategoryIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportExpensesToCSV } from '../../utils/csvHelper';
import { COUNTRIES_PRICE_DATA } from '../../data/countriesData';
import {
  Search,
  Filter,
  Download,
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';

interface ExpensesTableViewProps {
  trip: Trip;
  onEditExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onOpenAddModal: () => void;
  maskAmounts?: boolean;
}

export const ExpensesTableView: React.FC<ExpensesTableViewProps> = ({
  trip,
  onEditExpense,
  onDeleteExpense,
  onOpenAddModal,
  maskAmounts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount' | 'title'>('date');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Filtering & Sorting
  const filteredItems = useMemo(() => {
    return trip.items
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.locationCity && item.locationCity.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesPay = selectedPayment === 'all' || item.paymentMethod === selectedPayment;

        return matchesSearch && matchesCat && matchesPay;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortField === 'date') {
          comp = new Date(b.date).getTime() - new Date(a.date).getTime();
        } else if (sortField === 'amount') {
          comp = b.amountBase - a.amountBase;
        } else if (sortField === 'title') {
          comp = a.title.localeCompare(b.title);
        }
        return sortDirection === 'desc' ? comp : -comp;
      });
  }, [trip.items, searchTerm, selectedCategory, selectedPayment, sortField, sortDirection]);

  // Filtered Totals
  const filteredTotals = useMemo(() => {
    const totalBase = filteredItems.reduce((acc, curr) => acc + curr.amountBase, 0);
    const totalLocal = filteredItems.reduce((acc, curr) => acc + curr.amountOriginal, 0);
    return { totalBase, totalLocal };
  }, [filteredItems]);

  const toggleSort = (field: 'date' | 'amount' | 'title') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExportCSV = () => {
    exportExpensesToCSV(trip.items, trip.name, trip.baseCurrency, trip.localCurrency);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 1. Header Toolbar with Search & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Поиск по названию, городу или заметкам..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons: View mode toggle & Export CSV */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'table' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Табличный вид (как в Excel)"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Таблица</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  viewMode === 'cards' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Мобильный вид карточками"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Карточки</span>
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-xs font-medium transition active:scale-95"
              title="Скачать таблицу в CSV для Excel или Google Таблиц"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV экспорт</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-lg shrink-0 font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            Все ({trip.items.length})
          </button>
          {Object.values(CATEGORIES).map((cat) => {
            const count = trip.items.filter((i) => i.category === cat.id).length;
            if (count === 0 && selectedCategory !== cat.id) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? `${cat.bgColor} font-semibold ring-1 ring-white/20`
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                <CategoryIcon categoryId={cat.id} className="w-3 h-3" />
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Subtotal summary bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
        <div className="text-slate-400">
          Показано: <strong className="text-slate-200">{filteredItems.length}</strong> из {trip.items.length} строк
        </div>
        <div className="text-right">
          <span className="text-slate-400 mr-2">Итого в выборке:</span>
          <strong className="text-white text-sm">
            {formatCurrency(filteredTotals.totalBase, trip.baseCurrency, { isMasked: maskAmounts })}
          </strong>
          <span className="text-indigo-300 font-mono text-xs ml-1.5">
            ({formatCurrency(filteredTotals.totalLocal, trip.localCurrency, { isMasked: maskAmounts })})
          </span>
        </div>
      </div>

      {/* 3. Main Data: Table Mode or Cards Mode */}
      {viewMode === 'table' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="w-full">
            <table className="w-full table-fixed text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850 text-slate-300 select-none">
                  {/* Expense Title & Category */}
                  <th
                    onClick={() => toggleSort('title')}
                    className="py-3 px-2 sm:px-3.5 font-semibold cursor-pointer hover:text-white w-[42%] sm:w-[32%]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Расход / Категория</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500 shrink-0" />
                    </div>
                  </th>

                  {/* Amount: Combined Local & Base on Mobile */}
                  <th
                    onClick={() => toggleSort('amount')}
                    className="py-3 px-2 sm:px-3 font-semibold cursor-pointer hover:text-white text-right w-[43%] sm:w-[30%]"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span className="sm:hidden">Сумма</span>
                      <span className="hidden sm:inline">Сумма ({trip.baseCurrency} / {trip.localCurrency})</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500 shrink-0" />
                    </div>
                  </th>

                  {/* Payment Method & Date (hidden or compact on mobile) */}
                  <th
                    onClick={() => toggleSort('date')}
                    className="py-3 px-2 sm:px-3 font-semibold cursor-pointer hover:text-white hidden sm:table-cell sm:w-[26%]"
                  >
                    <div className="flex items-center gap-1">
                      <span>Оплата / Дата</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500 shrink-0" />
                    </div>
                  </th>

                  {/* Actions */}
                  <th className="py-3 px-1.5 sm:px-3 text-right w-[15%] sm:w-[12%]">
                    <span className="sr-only sm:not-sr-only">Действия</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const cat = CATEGORIES[item.category] || CATEGORIES['misc'];
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-800/50 transition group"
                      >
                        {/* 1. Title, Category, City, Notes & Mobile Sub-info */}
                        <td className="py-2.5 px-2 sm:px-3.5 align-middle">
                          <div className="min-w-0 pr-1">
                            <div className="font-semibold text-slate-100 truncate text-[12px] sm:text-xs leading-snug">
                              {item.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-0.5">
                              {item.countryCode && COUNTRIES_PRICE_DATA[item.countryCode] && (
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700 font-medium shrink-0">
                                  {COUNTRIES_PRICE_DATA[item.countryCode].flag} {COUNTRIES_PRICE_DATA[item.countryCode].countryName}
                                </span>
                              )}
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium leading-normal shrink-0"
                                style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                              >
                                <CategoryIcon categoryId={item.category} className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[80px] sm:max-w-none">{cat.name}</span>
                              </span>
                              {item.locationCity && (
                                <span className="text-[10px] text-slate-400 truncate max-w-[60px] sm:max-w-none">
                                  {item.locationCity}
                                </span>
                              )}
                              {/* On mobile, show payment & date here compactly */}
                              <span className="text-[10px] text-slate-400 sm:hidden">
                                {formatDate(item.date)}
                              </span>
                              <span className="sm:hidden">
                                <PaymentMethodBadge method={item.paymentMethod} />
                              </span>
                            </div>
                            {item.notes && (
                              <div className="text-[10px] text-slate-400 truncate mt-0.5 hidden sm:block">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 2. Compact Combined Amount: Base (RUB) prominent, Local (JPY) underneath */}
                        <td className="py-2.5 px-2 sm:px-3 text-right align-middle">
                          <div className="font-bold text-white text-[12px] sm:text-xs leading-tight">
                            {formatCurrency(item.amountBase, trip.baseCurrency, { isMasked: maskAmounts })}
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-indigo-300 font-mono leading-tight mt-0.5">
                            {formatCurrency(item.amountOriginal, trip.localCurrency, { isMasked: maskAmounts })}
                          </div>
                        </td>

                        {/* 3. Payment Method & Date (Desktop / Tablet) */}
                        <td className="py-2.5 px-2 sm:px-3 align-middle hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            <PaymentMethodBadge method={item.paymentMethod} />
                            <span className="text-slate-400 text-[11px] whitespace-nowrap">
                              {formatDate(item.date)}
                            </span>
                          </div>
                        </td>

                        {/* 4. Actions: Edit and Delete */}
                        <td className="py-2.5 px-1.5 sm:px-3 text-right align-middle">
                          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                            <button
                              onClick={() => onEditExpense(item)}
                              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition"
                              title="Редактировать"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteExpense(item.id)}
                              className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 px-4 text-center">
                      <div className="max-w-xs mx-auto space-y-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                          <Plus className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-white">Расходов пока нет</p>
                        <p className="text-[11px] text-slate-400">
                          {trip.items.length === 0
                            ? 'Нажмите кнопку ниже, чтобы внести первый расход в поездке'
                            : 'По заданному фильтру ничего не найдено'}
                        </p>
                        {trip.items.length === 0 && (
                          <button
                            onClick={onOpenAddModal}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Добавить первый расход</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Mobile Cards Mode */
        <div className="space-y-2.5">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const cat = CATEGORIES[item.category] || CATEGORIES['misc'];
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        <CategoryIcon categoryId={item.category} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-100 text-sm leading-tight truncate">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          {item.countryCode && COUNTRIES_PRICE_DATA[item.countryCode] && (
                            <>
                              <span>{COUNTRIES_PRICE_DATA[item.countryCode].flag} {COUNTRIES_PRICE_DATA[item.countryCode].countryName}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{formatDate(item.date)}</span>
                          {item.locationCity && (
                            <>
                              <span>•</span>
                              <span>{item.locationCity}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-white text-base">
                        {formatCurrency(item.amountBase, trip.baseCurrency, { isMasked: maskAmounts })}
                      </div>
                      <div className="text-xs text-indigo-300 font-mono">
                        {formatCurrency(item.amountOriginal, trip.localCurrency, { isMasked: maskAmounts })}
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-400 bg-slate-800/40 p-2 rounded-xl">
                      {item.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-xs">
                    <PaymentMethodBadge method={item.paymentMethod} />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditExpense(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 px-4 text-center bg-slate-900 rounded-2xl border border-slate-800">
              <div className="max-w-xs mx-auto space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                  <Plus className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-white">Расходов пока нет</p>
                <p className="text-[11px] text-slate-400">
                  {trip.items.length === 0
                    ? 'Нажмите кнопку ниже, чтобы внести первый расход в поездке'
                    : 'По заданному фильтру ничего не найдено'}
                </p>
                {trip.items.length === 0 && (
                  <button
                    onClick={onOpenAddModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Добавить первый расход</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
