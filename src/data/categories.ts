import { CategoryInfo, Currency } from '../types';

export const CATEGORIES: Record<string, CategoryInfo> = {
  transport_flight: {
    id: 'transport_flight',
    name: 'Авиабилеты и виза',
    icon: 'Plane',
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    description: 'Перелеты, визовые сборы, трансфер в аэропорт',
  },
  transport_local: {
    id: 'transport_local',
    name: 'Транспорт и поезда',
    icon: 'Train',
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'JR Pass, метро, синкансэны, Suica/Pasmo, такси',
  },
  accommodation: {
    id: 'accommodation',
    name: 'Проживание и отели',
    icon: 'Hotel',
    color: '#6366f1', // indigo-500
    bgColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    description: 'Отели, рёканы, капсулы, апартаменты',
  },
  food: {
    id: 'food',
    name: 'Еда и рестораны',
    icon: 'UtensilsCrossed',
    color: '#f59e0b', // amber-500
    bgColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Рамэн, суси, идзакаи, конибини 7-Eleven, стритфуд',
  },
  sightseeing: {
    id: 'sightseeing',
    name: 'Развлечения и музеи',
    icon: 'Landmark',
    color: '#f43f5e', // rose-500
    bgColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'teamLab, USJ, храмы, смотровые площадки, онсэны',
  },
  shopping: {
    id: 'shopping',
    name: 'Покупки и сувениры',
    icon: 'ShoppingBag',
    color: '#a855f7', // purple-500
    bgColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Don Quijote, электроника, одежда, японский чай, фигурки',
  },
  connectivity: {
    id: 'connectivity',
    name: 'Связь и интернет',
    icon: 'Wifi',
    color: '#06b6d4', // cyan-500
    bgColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    description: 'eSIM (Ubigi, Airalo), Pocket WiFi, роуминг',
  },
  misc: {
    id: 'misc',
    name: 'Разное и мелочи',
    icon: 'Coins',
    color: '#94a3b8', // slate-400
    bgColor: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    description: 'Автоматы Jihanki, камеры хранения, страховка, сувенирные монеты',
  },
};

export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺', rateToUSD: 91.5 },
  { code: 'JPY', name: 'Японская иена', symbol: '¥', flag: '🇯🇵', rateToUSD: 152.0 },
  { code: 'USD', name: 'Доллар США', symbol: '$', flag: '🇺🇸', rateToUSD: 1.0 },
  { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺', rateToUSD: 0.92 },
  { code: 'THB', name: 'Тайский бат', symbol: '฿', flag: '🇹🇭', rateToUSD: 36.5 },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', flag: '🇹🇷', rateToUSD: 34.0 },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳', rateToUSD: 7.23 },
  { code: 'KRW', name: 'Корейская вона', symbol: '₩', flag: '🇰🇷', rateToUSD: 1380.0 },
  { code: 'AED', name: 'Дирхам ОАЭ', symbol: 'د.إ', flag: '🇦🇪', rateToUSD: 3.67 },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', flag: '🇬🇧', rateToUSD: 0.78 },
  { code: 'GEL', name: 'Грузинский лари', symbol: '₾', flag: '🇬🇪', rateToUSD: 2.7 },
  { code: 'KZT', name: 'Казахстанский тенге', symbol: '₸', flag: '🇰🇿', rateToUSD: 480.0 },
];
