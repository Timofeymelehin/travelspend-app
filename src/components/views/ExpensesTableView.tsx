import React, { useState, useMemo } from 'react';
import { Trip, ExpenseItem } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon, PaymentMethodBadge } from '../CategoryIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportExpensesToCSV } from '../../utils/csvHelper';
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-850 text-slate-300">
                  <th
                    onClick={() => toggleSort('title')}
                    className="py-3 px-3.5 font-semibold cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Название расхода</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">Категория</th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-white text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{trip.localCurrency}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort('amount')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-white text-right"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>{trip.baseCurrency}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">Оплата</th>
                  <th className="py-3 px-3 font-semibold hidden md:table-cell">Город</th>
                  <th
                    onClick={() => toggleSort('date')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>Дата</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </th>
                  <th className="py-3 px-3 text-right">Действия</th>
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
                        {/* Title & Notes */}
                        <td className="py-2.5 px-3.5 max-w-[200px]">
                          <div className="font-semibold text-slate-100 truncate">
                            {item.title}
                          </div>
                          {item.notes && (
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.notes}
                            </div>
                          )}
                        </td>

                        {/* Category */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-medium"
                            style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                          >
                            <CategoryIcon categoryId={item.category} className="w-3 h-3" />
                            <span>{cat.name}</span>
                          </span>
                        </td>

                        {/* Local Amount (JPY) */}
                        <td className="py-2.5 px-3 text-right font-mono font-medium text-slate-300 whitespace-nowrap">
                          {formatCurrency(item.amountOriginal, trip.localCurrency, { isMasked: maskAmounts })}
                        </td>

                        {/* Base Amount (RUB) */}
                        <td className="py-2.5 px-3 text-right font-bold text-white whitespace-nowrap">
                          {formatCurrency(item.amountBase, trip.baseCurrency, { isMasked: maskAmounts })}
                        </td>

                        {/* Payment Method */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <PaymentMethodBadge method={item.paymentMethod} />
                        </td>

                        {/* City */}
                        <td className="py-2.5 px-3 text-slate-300 hidden md:table-cell whitespace-nowrap">
                          {item.locationCity || '—'}
                        </td>

                        {/* Date */}
                        <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                          {formatDate(item.date)}
                        </td>

                        {/* Actions */}
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
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
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      По вашему запросу ничего не найдено
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
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-900 rounded-2xl border border-slate-800">
              Ничего не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
};
