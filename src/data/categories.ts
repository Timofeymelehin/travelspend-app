import { CategoryInfo, Currency } from '../types';

export const CATEGORIES: Record<string, CategoryInfo> = {
  food: {
    id: 'food',
    name: 'Еда и продукты',
    icon: 'UtensilsCrossed',
    color: '#f59e0b', // amber-500
    bgColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Супермаркеты, кафе, рестораны, доставка еды, кофе',
  },
  home_bills: {
    id: 'home_bills',
    name: 'Жилье и ЖКУ',
    icon: 'Home',
    color: '#3b82f6', // blue-500
    bgColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'Аренда, ипотека, коммунальные платежи, интернет, счетчики',
  },
  transport_local: {
    id: 'transport_local',
    name: 'Транспорт и авто',
    icon: 'Train',
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Метро, автобус, такси, бензин, парковка, каршеринг',
  },
  shopping: {
    id: 'shopping',
    name: 'Покупки и одежда',
    icon: 'ShoppingBag',
    color: '#a855f7', // purple-500
    bgColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Одежда, обувь, маркетплейсы, техника, товары для дома',
  },
  health: {
    id: 'health',
    name: 'Здоровье и аптека',
    icon: 'HeartPulse',
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    description: 'Аптека, врачи, анализы, спортзал, стоматология',
  },
  sightseeing: {
    id: 'sightseeing',
    name: 'Развлечения и отдых',
    icon: 'Landmark',
    color: '#f43f5e', // rose-500
    bgColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Кино, выставки, концерты, хобби, подписки, экскурсии',
  },
  transport_flight: {
    id: 'transport_flight',
    name: 'Билеты и путешествия',
    icon: 'Plane',
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    description: 'Авиабилеты, поезда дальнего следования, отели, визы',
  },
  accommodation: {
    id: 'accommodation',
    name: 'Отели и аренда',
    icon: 'Hotel',
    color: '#6366f1', // indigo-500
    bgColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    description: 'Отели, гостиницы, апартаменты в поездках',
  },
  connectivity: {
    id: 'connectivity',
    name: 'Связь и сервисы',
    icon: 'Wifi',
    color: '#06b6d4', // cyan-500
    bgColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    description: 'Мобильная связь, интернет, облачные подписки',
  },
  misc: {
    id: 'misc',
    name: 'Прочее и мелочи',
    icon: 'Coins',
    color: '#94a3b8', // slate-400
    bgColor: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    description: 'Подарки, комиссии банков, непредвиденные траты',
  },
};

export const POPULAR_CURRENCIES: Currency[] = [
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺', rateToUSD: 91.5 },
  { code: 'USD', name: 'Доллар США', symbol: '$', flag: '🇺🇸', rateToUSD: 1.0 },
  { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺', rateToUSD: 0.92 },
  { code: 'KZT', name: 'Казахстанский тенге', symbol: '₸', flag: '🇰🇿', rateToUSD: 480.0 },
  { code: 'GEL', name: 'Грузинский лари', symbol: '₾', flag: '🇬🇪', rateToUSD: 2.7 },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', flag: '🇹🇷', rateToUSD: 34.0 },
  { code: 'AED', name: 'Дирхам ОАЭ', symbol: 'د.إ', flag: '🇦🇪', rateToUSD: 3.67 },
  { code: 'THB', name: 'Тайский бат', symbol: '฿', flag: '🇹🇭', rateToUSD: 36.5 },
  { code: 'JPY', name: 'Японская иена', symbol: '¥', flag: '🇯🇵', rateToUSD: 152.0 },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳', rateToUSD: 7.23 },
  { code: 'KRW', name: 'Корейская вона', symbol: '₩', flag: '🇰🇷', rateToUSD: 1380.0 },
  { code: 'GBP', name: 'Фунт стерлингов', symbol: '£', flag: '🇬🇧', rateToUSD: 0.78 },
];
