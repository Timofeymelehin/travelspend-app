import React, { useMemo, useState } from 'react';
import { Trip, ExpenseItem } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon, PaymentMethodBadge } from '../CategoryIcon';
import { formatCurrency } from '../../utils/formatters';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Wallet,
  Users,
  Calendar,
  CreditCard,
  Building2,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Award,
} from 'lucide-react';

interface AnalyticsViewProps {
  trip: Trip;
  exchangeRate: number;
  maskAmounts?: boolean;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ trip, exchangeRate, maskAmounts }) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);

  // Total spent in base currency & local currency
  const { totalSpentBase, totalSpentLocal, categoryStats, paymentStats, cityStats, topExpenses, dailyAverage } =
    useMemo(() => {
      let spentBase = 0;
      let spentLocal = 0;

      const catMap: Record<string, { totalBase: number; totalLocal: number; count: number }> = {};
      const payMap: Record<string, { totalBase: number; totalLocal: number; count: number }> = {};
      const cityMap: Record<string, { totalBase: number; count: number }> = {};
      const uniqueDays = new Set<string>();

      trip.items.forEach((item) => {
        spentBase += item.amountBase;
        spentLocal += item.amountOriginal;
        uniqueDays.add(item.date);

        // Category
        if (!catMap[item.category]) {
          catMap[item.category] = { totalBase: 0, totalLocal: 0, count: 0 };
        }
        catMap[item.category].totalBase += item.amountBase;
        catMap[item.category].totalLocal += item.amountOriginal;
        catMap[item.category].count += 1;

        // Payment Method
        if (!payMap[item.paymentMethod]) {
          payMap[item.paymentMethod] = { totalBase: 0, totalLocal: 0, count: 0 };
        }
        payMap[item.paymentMethod].totalBase += item.amountBase;
        payMap[item.paymentMethod].totalLocal += item.amountOriginal;
        payMap[item.paymentMethod].count += 1;

        // City
        const city = item.locationCity || 'Другое';
        if (!cityMap[city]) {
          cityMap[city] = { totalBase: 0, count: 0 };
        }
        cityMap[city].totalBase += item.amountBase;
        cityMap[city].count += 1;
      });

      // Category array sorted
      const catList = Object.entries(catMap)
        .map(([catId, data]) => {
          const info = CATEGORIES[catId] || CATEGORIES['misc'];
          const percent = spentBase > 0 ? (data.totalBase / spentBase) * 100 : 0;
          return {
            id: catId,
            name: info.name,
            color: info.color,
            totalBase: data.totalBase,
            totalLocal: data.totalLocal,
            count: data.count,
            percent,
          };
        })
        .sort((a, b) => b.totalBase - a.totalBase);

      // Payment array
      const payList = Object.entries(payMap)
        .map(([pm, data]) => ({
          method: pm,
          totalBase: data.totalBase,
          totalLocal: data.totalLocal,
          count: data.count,
          percent: spentBase > 0 ? (data.totalBase / spentBase) * 100 : 0,
        }))
        .sort((a, b) => b.totalBase - a.totalBase);

      // City array
      const cityList = Object.entries(cityMap)
        .map(([city, data]) => ({
          city,
          totalBase: data.totalBase,
          percent: spentBase > 0 ? (data.totalBase / spentBase) * 100 : 0,
        }))
        .sort((a, b) => b.totalBase - a.totalBase);

      // Top 5 largest expenses
      const top = [...trip.items].sort((a, b) => b.amountBase - a.amountBase).slice(0, 5);

      const daysCount = Math.max(uniqueDays.size, 1);
      const avg = spentBase / daysCount;

      return {
        totalSpentBase: spentBase,
        totalSpentLocal: spentLocal,
        categoryStats: catList,
        paymentStats: payList,
        cityStats: cityList,
        topExpenses: top,
        dailyAverage: avg,
      };
    }, [trip.items]);

  const budgetProgress = trip.totalBudgetBase > 0 ? (totalSpentBase / trip.totalBudgetBase) * 100 : 0;
  const remainingBudget = trip.totalBudgetBase - totalSpentBase;
  const perPersonBase = trip.travelersCount > 0 ? totalSpentBase / trip.travelersCount : totalSpentBase;
  const perPersonLocal = trip.travelersCount > 0 ? totalSpentLocal / trip.travelersCount : totalSpentLocal;

  // Pie chart data
  const chartData = categoryStats.map((c) => ({
    name: c.name,
    value: Math.round(c.totalBase),
    color: c.color,
    localValue: c.totalLocal,
  }));

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* 1. Main Hero Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Spent Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-indigo-400" />
              Всего расходов
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {trip.items.length} поз.
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(totalSpentBase, trip.baseCurrency, { isMasked: maskAmounts })}
          </div>
          {trip.baseCurrency !== trip.localCurrency && (
            <div className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <span>Эквивалент:</span>
              <span className="text-indigo-300 font-mono">
                {formatCurrency(totalSpentLocal, trip.localCurrency, { isMasked: maskAmounts })}
              </span>
            </div>
          )}
        </div>

        {/* Per Person Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-400" />
              На 1 человека ({trip.travelersCount} {trip.travelersCount === 1 ? 'чел' : 'чел.'})
            </span>
          </div>
          <div className="text-2xl font-black text-white tracking-tight">
            {formatCurrency(perPersonBase, trip.baseCurrency, { isMasked: maskAmounts })}
          </div>
          {trip.baseCurrency !== trip.localCurrency && (
            <div className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
              <span>В {trip.localCurrency}:</span>
              <span className="text-sky-300 font-mono">
                {formatCurrency(perPersonLocal, trip.localCurrency, { isMasked: maskAmounts })}
              </span>
            </div>
          )}
        </div>

        {/* Budget Status Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl sm:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              {trip.tripType === 'home' ? 'Лимит на месяц' : 'Бюджет поездки'} ({formatCurrency(trip.totalBudgetBase, trip.baseCurrency, { isMasked: maskAmounts })})
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                remainingBudget >= 0
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {remainingBudget >= 0 ? 'В рамках бюджета' : 'Превышение бюджета'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden my-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetProgress > 100
                  ? 'bg-rose-500'
                  : budgetProgress > 85
                  ? 'bg-amber-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Использовано: <strong className="text-slate-200">{budgetProgress.toFixed(1)}%</strong></span>
            <span>
              {remainingBudget >= 0 ? 'Остаток:' : 'Превышение на:'}{' '}
              <strong className={remainingBudget >= 0 ? 'text-emerald-300' : 'text-rose-400'}>
                {formatCurrency(Math.abs(remainingBudget), trip.baseCurrency)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Chart: Category Donut & List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Расходы по категориям</span>
            </h2>
            <p className="text-xs text-slate-400">Наглядная визуализация структуры затрат в поездке</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Recharts Donut */}
          <div className="md:col-span-5 h-64 relative flex items-center justify-center">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-xs">
                            <p className="font-bold text-white mb-1" style={{ color: data.color }}>
                              {data.name}
                            </p>
                            <p className="text-slate-200">
                              {formatCurrency(data.value, trip.baseCurrency)}
                            </p>
                            <p className="text-slate-400 font-mono">
                              {formatCurrency(data.localValue, trip.localCurrency)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-500">Нет данных для графика</div>
            )}

            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Всего</span>
              <span className="text-base font-black text-white">
                {formatCurrency(totalSpentBase, trip.baseCurrency, { compact: true })}
              </span>
            </div>
          </div>

          {/* Category List with Bars */}
          <div className="md:col-span-7 space-y-2.5">
            {categoryStats.map((cat) => (
              <div
                key={cat.id}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-750/50 hover:bg-slate-800 transition"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      <CategoryIcon categoryId={cat.id} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-200 truncate">{cat.name}</span>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                      ({cat.count} поз.)
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-white text-xs">
                      {formatCurrency(cat.totalBase, trip.baseCurrency)}
                    </span>
                    <span className="text-[11px] text-indigo-300 font-mono ml-2">
                      {cat.percent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar per category */}
                <div className="h-1.5 w-full bg-slate-700/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Secondary Analytics: Payment Methods & Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Payment Methods */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            Способы оплаты
          </h3>
          <div className="space-y-3">
            {paymentStats.map((pm) => (
              <div key={pm.method} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <PaymentMethodBadge method={pm.method} />
                  <div className="text-right">
                    <span className="font-semibold text-slate-200">
                      {formatCurrency(pm.totalBase, trip.baseCurrency)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                      ({pm.percent.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${pm.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cities Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Расходы по городам / локациям
          </h3>
          <div className="space-y-3">
            {cityStats.map((cs) => (
              <div key={cs.city} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300">{cs.city}</span>
                  <div className="text-right">
                    <span className="font-semibold text-slate-200">
                      {formatCurrency(cs.totalBase, trip.baseCurrency)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-1.5">
                      ({cs.percent.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${cs.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Top 5 Major Expenses */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-rose-400" />
          Топ крупнейших трат в поездке
        </h3>
        <div className="divide-y divide-slate-800/80">
          {topExpenses.map((item, idx) => (
            <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-200 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>{CATEGORIES[item.category]?.name}</span>
                    <span>•</span>
                    <span>{item.locationCity || 'Япония'}</span>
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-white">{formatCurrency(item.amountBase, trip.baseCurrency)}</p>
                <p className="text-[11px] text-indigo-300 font-mono">
                  {formatCurrency(item.amountOriginal, trip.localCurrency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
