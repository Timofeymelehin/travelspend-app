import { Currency } from '../types';

export interface CountryCheatSheetItem {
  item: string;
  priceLocal: number;
  icon: string;
  category: 'food' | 'transport' | 'stay' | 'sightseeing' | 'other';
  note?: string;
  // Dynamic price adjustment based on time of day (morning breakfast, midday lunch, evening dinner)
  timeOfDay?: 'morning' | 'day' | 'night' | 'all';
}

export interface CountryPriceInfo {
  countryCode: string; // e.g. 'JP', 'TH', 'TR', 'AE', 'EU', 'US', 'GE', 'CN', 'KR'
  countryName: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  defaultCities: string[];
  // Cheat sheet items
  cheatSheet: CountryCheatSheetItem[];
  // Quick expense suggestions for the add modal
  quickSuggestions: {
    title: string;
    cat: string;
    amountLocal: number;
    timeOfDay?: 'morning' | 'day' | 'night' | 'all';
  }[];
}

export const COUNTRIES_PRICE_DATA: Record<string, CountryPriceInfo> = {
  RU: {
    countryCode: 'RU',
    countryName: 'Россия (Дом)',
    flag: '🇷🇺',
    currencyCode: 'RUB',
    currencySymbol: '₽',
    defaultCities: ['Москва', 'Санкт-Петербург', 'Казань', 'Сочи', 'Екатеринбург', 'Новосибирск'],
    cheatSheet: [
      { item: 'Кофе на вынос (капучино/латте)', priceLocal: 220, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Сырники или круассан на завтрак', priceLocal: 280, icon: '🥐', category: 'food', timeOfDay: 'morning' },
      { item: 'Бизнес-ланч в кафе / столовой', priceLocal: 450, icon: '🍲', category: 'food', timeOfDay: 'day' },
      { item: 'Продукты в супермаркете (корзина дня)', priceLocal: 1200, icon: '🛒', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин в ресторане на одного', priceLocal: 1600, icon: '🍽️', category: 'food', timeOfDay: 'night' },
      { item: 'Поездка на метро / автобусе (Тройка)', priceLocal: 57, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Поездка на такси по городу', priceLocal: 450, icon: '🚕', category: 'transport', timeOfDay: 'night' },
      { item: 'Доставка еды (Яндекс/Самокат)', priceLocal: 850, icon: '🥡', category: 'food', timeOfDay: 'night' },
      { item: 'Коммунальные услуги / ЖКУ в месяц', priceLocal: 6500, icon: '🏠', category: 'stay', timeOfDay: 'all' },
      { item: 'Билет в кино / на выставку', priceLocal: 550, icon: '🎬', category: 'sightseeing', timeOfDay: 'day' },
    ],
    quickSuggestions: [
      { title: 'Супермаркет (продукты)', cat: 'food', amountLocal: 1500, timeOfDay: 'day' },
      { title: 'Кофе с собой', cat: 'food', amountLocal: 220, timeOfDay: 'morning' },
      { title: 'Обед / Бизнес-ланч', cat: 'food', amountLocal: 450, timeOfDay: 'day' },
      { title: 'Поездка на такси', cat: 'transport_local', amountLocal: 480, timeOfDay: 'night' },
      { title: 'Метро / Общественный транспорт', cat: 'transport_local', amountLocal: 57, timeOfDay: 'all' },
      { title: 'Доставка еды / Ужин', cat: 'food', amountLocal: 950, timeOfDay: 'night' },
      { title: 'Аптека / Здоровье', cat: 'health', amountLocal: 650, timeOfDay: 'day' },
      { title: 'ЖКУ / Квартплата', cat: 'home_bills', amountLocal: 6000, timeOfDay: 'all' },
      { title: 'Покупки для дома / Одежда', cat: 'shopping', amountLocal: 2500, timeOfDay: 'day' },
    ],
  },
  KZ: {
    countryCode: 'KZ',
    countryName: 'Казахстан',
    flag: '🇰🇿',
    currencyCode: 'KZT',
    currencySymbol: '₸',
    defaultCities: ['Алматы', 'Астана', 'Шымкент'],
    cheatSheet: [
      { item: 'Кофе на вынос в кофейне', priceLocal: 1200, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Самса / баурсаки на перекус', priceLocal: 500, icon: '🥟', category: 'food', timeOfDay: 'morning' },
      { item: 'Бизнес-ланч / лагман на обед', priceLocal: 2800, icon: '🍜', category: 'food', timeOfDay: 'day' },
      { item: 'Продукты в Magnum / Small', priceLocal: 6500, icon: '🛒', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин с бешбармаком в ресторане', priceLocal: 8000, icon: '🥩', category: 'food', timeOfDay: 'night' },
      { item: 'Проезд на автобусе / метро (Onay)', priceLocal: 120, icon: '🚌', category: 'transport', timeOfDay: 'all' },
      { item: 'Яндекс Такси по городу', priceLocal: 1800, icon: '🚕', category: 'transport', timeOfDay: 'night' },
      { item: 'Канатная дорога на Кок-Тобе', priceLocal: 3500, icon: '🚡', category: 'sightseeing', timeOfDay: 'day' },
    ],
    quickSuggestions: [
      { title: 'Супермаркет (Magnum)', cat: 'food', amountLocal: 6500, timeOfDay: 'day' },
      { title: 'Кофе и выпечка', cat: 'food', amountLocal: 1500, timeOfDay: 'morning' },
      { title: 'Обед (лагман/плов)', cat: 'food', amountLocal: 2800, timeOfDay: 'day' },
      { title: 'Яндекс Такси', cat: 'transport_local', amountLocal: 1800, timeOfDay: 'all' },
      { title: 'Пополнение карты Оңай', cat: 'transport_local', amountLocal: 2000, timeOfDay: 'all' },
      { title: 'Аптека', cat: 'health', amountLocal: 3500, timeOfDay: 'day' },
    ],
  },
  JP: {
    countryCode: 'JP',
    countryName: 'Япония',
    flag: '🇯🇵',
    currencyCode: 'JPY',
    currencySymbol: '¥',
    defaultCities: ['Токио', 'Киото', 'Осака', 'Нара', 'Саппоро'],
    cheatSheet: [
      { item: 'Зеленый чай / вода в Jihanki', priceLocal: 160, icon: '🥤', category: 'food', timeOfDay: 'all' },
      { item: 'Онигири с лососем в 7-Eleven', priceLocal: 180, icon: '🍙', category: 'food', timeOfDay: 'morning' },
      { item: 'Тамаго-сэндвич и кофе в Lawson', priceLocal: 380, icon: '🥪', category: 'food', timeOfDay: 'morning' },
      { item: 'Бенто-ланч в супермаркете', priceLocal: 680, icon: '🍱', category: 'food', timeOfDay: 'day' },
      { item: 'Тарелка рамэна (Ichiran)', priceLocal: 1150, icon: '🍜', category: 'food', timeOfDay: 'day' },
      { item: 'Сет суси на обед (конвейер)', priceLocal: 1900, icon: '🍣', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин в идзакае с пивом', priceLocal: 3800, icon: '🍻', category: 'food', timeOfDay: 'night' },
      { item: 'Поездка на метро (Токио)', priceLocal: 220, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Синкансэн Токио — Киото (Nozomi)', priceLocal: 14200, icon: '🚄', category: 'transport', timeOfDay: 'all' },
      { item: 'Порог для Tax-Free (возврат 10%)', priceLocal: 5500, icon: '🏷️', category: 'other', timeOfDay: 'all' },
      { item: 'Бизнес-отель 3★ за ночь', priceLocal: 13000, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Рамэн', cat: 'food', amountLocal: 1200, timeOfDay: 'day' },
      { title: 'Пополнение карты Suica/IC', cat: 'transport_local', amountLocal: 3000, timeOfDay: 'all' },
      { title: 'Онигири и кофе (7-Eleven)', cat: 'food', amountLocal: 450, timeOfDay: 'morning' },
      { title: 'Билеты в метро', cat: 'transport_local', amountLocal: 350, timeOfDay: 'all' },
      { title: 'Напиток в автомате Jihanki', cat: 'misc', amountLocal: 160, timeOfDay: 'all' },
      { title: 'Сувениры Don Quijote', cat: 'shopping', amountLocal: 5500, timeOfDay: 'day' },
      { title: 'Ужин в идзакае', cat: 'food', amountLocal: 4200, timeOfDay: 'night' },
      { title: 'Входной билет в храм / сад', cat: 'sightseeing', amountLocal: 600, timeOfDay: 'day' },
    ],
  },
  TH: {
    countryCode: 'TH',
    countryName: 'Таиланд',
    flag: '🇹🇭',
    currencyCode: 'THB',
    currencySymbol: '฿',
    defaultCities: ['Бангкок', 'Пхукет', 'Чиангмай', 'Самуи', 'Паттайя'],
    cheatSheet: [
      { item: 'Тайский холодный чай (Cha Tra Mue)', priceLocal: 50, icon: '🧋', category: 'food', timeOfDay: 'day' },
      { item: 'Тост с сыром в 7-Eleven', priceLocal: 35, icon: '🥪', category: 'food', timeOfDay: 'morning' },
      { item: 'Пад Тай со свининой на рынке', priceLocal: 70, icon: '🍜', category: 'food', timeOfDay: 'day' },
      { item: 'Том Ям с креветками в кафе', priceLocal: 180, icon: '🍲', category: 'food', timeOfDay: 'day' },
      { item: 'Свежий манго с клейким рисом', priceLocal: 80, icon: '🥭', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин морепродуктами на найтмаркете', priceLocal: 650, icon: '🦐', category: 'food', timeOfDay: 'night' },
      { item: 'Кокос холодный на пляже', priceLocal: 60, icon: '🥥', category: 'food', timeOfDay: 'day' },
      { item: 'Поездка на BTS / Скайтрейне', priceLocal: 45, icon: '🚝', category: 'transport', timeOfDay: 'all' },
      { item: 'Поездка на тук-туке (торг)', priceLocal: 150, icon: '🛺', category: 'transport', timeOfDay: 'night' },
      { item: 'Тайский массаж (1 час)', priceLocal: 300, icon: '💆', category: 'other', timeOfDay: 'day' },
      { item: 'Номер в гестхаусе/отеле за ночь', priceLocal: 1200, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Пад Тай / стритфуд', cat: 'food', amountLocal: 80, timeOfDay: 'day' },
      { title: 'Завтрак в 7-Eleven', cat: 'food', amountLocal: 70, timeOfDay: 'morning' },
      { title: 'Том Ям в кафе', cat: 'food', amountLocal: 180, timeOfDay: 'day' },
      { title: 'Тайский массаж 1 час', cat: 'misc', amountLocal: 300, timeOfDay: 'day' },
      { title: 'Такси / Grab / Тук-тук', cat: 'transport_local', amountLocal: 150, timeOfDay: 'all' },
      { title: 'Фрукты / Шейк манго', cat: 'food', amountLocal: 60, timeOfDay: 'day' },
      { title: 'Ужин с морепродуктами', cat: 'food', amountLocal: 550, timeOfDay: 'night' },
      { title: 'Экскурсия на острова', cat: 'sightseeing', amountLocal: 1600, timeOfDay: 'morning' },
    ],
  },
  TR: {
    countryCode: 'TR',
    countryName: 'Турция',
    flag: '🇹🇷',
    currencyCode: 'TRY',
    currencySymbol: '₺',
    defaultCities: ['Стамбул', 'Анталья', 'Каппадокия', 'Измир', 'Бодрум'],
    cheatSheet: [
      { item: 'Чай в бардаке (Çay)', priceLocal: 25, icon: '☕', category: 'food', timeOfDay: 'all' },
      { item: 'Свежий симит с кунжутом на улице', priceLocal: 20, icon: '🥯', category: 'food', timeOfDay: 'morning' },
      { item: 'Традиционный турецкий завтрак', priceLocal: 350, icon: '🍳', category: 'food', timeOfDay: 'morning' },
      { item: 'Донер-кебаб (дюрюм) на обед', priceLocal: 220, icon: '🌯', category: 'food', timeOfDay: 'day' },
      { item: 'Свежевыжатый гранатовый сок', priceLocal: 90, icon: '🥤', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин с кебабом и мезе', priceLocal: 600, icon: '🥩', category: 'food', timeOfDay: 'night' },
      { item: 'Пахлава с фисташками (порция)', priceLocal: 180, icon: '🍯', category: 'food', timeOfDay: 'day' },
      { item: 'Паром через Босфор по Istanbulkart', priceLocal: 35, icon: '⛴️', category: 'transport', timeOfDay: 'all' },
      { item: 'Поездка на метро или трамвае Т1', priceLocal: 25, icon: '🚋', category: 'transport', timeOfDay: 'all' },
      { item: 'Полет на воздушном шаре Каппадокии', priceLocal: 6500, icon: '🎈', category: 'sightseeing', timeOfDay: 'morning' },
      { item: 'Отель в Султанахмет за ночь', priceLocal: 2500, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Донер / Дюрюм кебаб', cat: 'food', amountLocal: 220, timeOfDay: 'day' },
      { title: 'Симит + турецкий чай', cat: 'food', amountLocal: 45, timeOfDay: 'morning' },
      { title: 'Пополнение Istanbulkart', cat: 'transport_local', amountLocal: 200, timeOfDay: 'all' },
      { title: 'Паром по Босфору', cat: 'transport_local', amountLocal: 35, timeOfDay: 'day' },
      { title: 'Пахлава и десерты', cat: 'food', amountLocal: 180, timeOfDay: 'day' },
      { title: 'Турецкий ужин с кебабом', cat: 'food', amountLocal: 650, timeOfDay: 'night' },
      { title: 'Вход в музей / дворец', cat: 'sightseeing', amountLocal: 850, timeOfDay: 'day' },
      { title: 'Гранатовый сок', cat: 'food', amountLocal: 90, timeOfDay: 'day' },
    ],
  },
  AE: {
    countryCode: 'AE',
    countryName: 'ОАЭ',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencySymbol: 'AED',
    defaultCities: ['Дубай', 'Абу-Даби', 'Шарджа'],
    cheatSheet: [
      { item: 'Карака чай (Karak Chai)', priceLocal: 4, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Шаурма в кафе в Дейре', priceLocal: 14, icon: '🌯', category: 'food', timeOfDay: 'day' },
      { item: 'Кофе латте в молле', priceLocal: 26, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Бизнес-ланч в Марина/Downtown', priceLocal: 75, icon: '🥗', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин в ресторане у фонтанов', priceLocal: 240, icon: '🍽️', category: 'food', timeOfDay: 'night' },
      { item: 'Поездка на метро Дубая (Nol card)', priceLocal: 8, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Лодка Абра через Дубай Крик', priceLocal: 2, icon: '⛵', category: 'transport', timeOfDay: 'all' },
      { item: 'Такси Careem по городу', priceLocal: 45, icon: '🚕', category: 'transport', timeOfDay: 'night' },
      { item: 'Билет на смотровую Burj Khalifa', priceLocal: 180, icon: '🏙️', category: 'sightseeing', timeOfDay: 'day' },
      { item: 'Отель 4★ за ночь', priceLocal: 550, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Шаурма / перекус', cat: 'food', amountLocal: 15, timeOfDay: 'day' },
      { title: 'Пополнение Nol Card (метро)', cat: 'transport_local', amountLocal: 50, timeOfDay: 'all' },
      { title: 'Кофе в Дубай Молле', cat: 'food', amountLocal: 28, timeOfDay: 'morning' },
      { title: 'Такси по городу', cat: 'transport_local', amountLocal: 45, timeOfDay: 'all' },
      { title: 'Ужин в ресторане', cat: 'food', amountLocal: 200, timeOfDay: 'night' },
      { title: 'Билет Burj Khalifa / Лувр Абу-Даби', cat: 'sightseeing', amountLocal: 180, timeOfDay: 'day' },
      { title: 'Сафари в пустыне', cat: 'sightseeing', amountLocal: 260, timeOfDay: 'day' },
    ],
  },
  EU: {
    countryCode: 'EU',
    countryName: 'Европа (Еврозона)',
    flag: '🇪🇺',
    currencyCode: 'EUR',
    currencySymbol: '€',
    defaultCities: ['Париж', 'Рим', 'Барселона', 'Берлин', 'Вена'],
    cheatSheet: [
      { item: 'Эспрессо у барной стойки (Италия)', priceLocal: 1.5, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Круассан в пекарне (Франция)', priceLocal: 1.8, icon: '🥐', category: 'food', timeOfDay: 'morning' },
      { item: 'Сэндвич / багет на вынос', priceLocal: 6.5, icon: '🥖', category: 'food', timeOfDay: 'day' },
      { item: 'Пицца Маргарита в траттории', priceLocal: 11, icon: '🍕', category: 'food', timeOfDay: 'day' },
      { item: 'Сет тапас с бокалом сангрии', priceLocal: 16, icon: '🍷', category: 'food', timeOfDay: 'night' },
      { item: 'Ужин из 2 блюд с вином', priceLocal: 38, icon: '🍽️', category: 'food', timeOfDay: 'night' },
      { item: 'Билет на метро / автобус (1 поездка)', priceLocal: 2.2, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Скоростной поезд TGV / Frecciarossa', priceLocal: 55, icon: '🚄', category: 'transport', timeOfDay: 'all' },
      { item: 'Билет в Лувр / Колизей', priceLocal: 22, icon: '🏛️', category: 'sightseeing', timeOfDay: 'day' },
      { item: 'Отель 3★ в центре за ночь', priceLocal: 110, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Кофе и круассан', cat: 'food', amountLocal: 4.5, timeOfDay: 'morning' },
      { title: 'Билет на метро / автобус', cat: 'transport_local', amountLocal: 2.5, timeOfDay: 'all' },
      { title: 'Обед / пицца / паста', cat: 'food', amountLocal: 14, timeOfDay: 'day' },
      { title: 'Билет в музей / достопримечательность', cat: 'sightseeing', amountLocal: 20, timeOfDay: 'day' },
      { title: 'Ужин с бокалом вина', cat: 'food', amountLocal: 35, timeOfDay: 'night' },
      { title: 'Супермаркет (вода, снеки, сыр)', cat: 'food', amountLocal: 15, timeOfDay: 'all' },
      { title: 'Городской налог (City tax в отеле)', cat: 'accommodation', amountLocal: 6, timeOfDay: 'night' },
    ],
  },
  US: {
    countryCode: 'US',
    countryName: 'США',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    defaultCities: ['Нью-Йорк', 'Лос-Анджелес', 'Майами', 'Лас-Вегас', 'Сан-Франциско'],
    cheatSheet: [
      { item: 'Фильтр-кофе / Американо в Starbucks', priceLocal: 4.5, icon: '☕', category: 'food', timeOfDay: 'morning' },
      { item: 'Бейгл с крем-чизом на завтрак', priceLocal: 5.5, icon: '🥯', category: 'food', timeOfDay: 'morning' },
      { item: 'Слайс нью-йоркской пиццы', priceLocal: 3.5, icon: '🍕', category: 'food', timeOfDay: 'day' },
      { item: 'Бургер комбо в Shake Shack', priceLocal: 16, icon: '🍔', category: 'food', timeOfDay: 'day' },
      { item: 'Ужин в дайнере (+ чаевые 18-20%)', priceLocal: 45, icon: '🍽️', category: 'food', timeOfDay: 'night' },
      { item: 'Поездка на метро NYC (OMNY)', priceLocal: 2.9, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Uber / Lyft по городу', priceLocal: 32, icon: '🚕', category: 'transport', timeOfDay: 'night' },
      { item: 'Билет на смотровую (Edge/Summit)', priceLocal: 48, icon: '🏙️', category: 'sightseeing', timeOfDay: 'day' },
      { item: 'Отель в центре за ночь (+ tax)', priceLocal: 220, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Кофе и бейгл', cat: 'food', amountLocal: 9, timeOfDay: 'morning' },
      { title: 'Метро (NYC Subway OMNY)', cat: 'transport_local', amountLocal: 2.9, timeOfDay: 'all' },
      { title: 'Бургер / Обед Shake Shack', cat: 'food', amountLocal: 18, timeOfDay: 'day' },
      { title: 'Такси Uber / Lyft', cat: 'transport_local', amountLocal: 30, timeOfDay: 'all' },
      { title: 'Ужин в ресторане (с tips)', cat: 'food', amountLocal: 60, timeOfDay: 'night' },
      { title: 'Билет на бродвейский мюзикл', cat: 'sightseeing', amountLocal: 120, timeOfDay: 'night' },
      { title: 'Покупки в аптеке CVS/Walgreens', cat: 'shopping', amountLocal: 25, timeOfDay: 'all' },
    ],
  },
  GE: {
    countryCode: 'GE',
    countryName: 'Грузия',
    flag: '🇬🇪',
    currencyCode: 'GEL',
    currencySymbol: '₾',
    defaultCities: ['Тбилиси', 'Батуми', 'Кутаиси', 'Казбеги'],
    cheatSheet: [
      { item: 'Боржоми в бутылке', priceLocal: 2, icon: '🥤', category: 'food', timeOfDay: 'all' },
      { item: 'Горячий шоти (хлеб из тоне)', priceLocal: 1.5, icon: '🥖', category: 'food', timeOfDay: 'morning' },
      { item: 'Хачапури по-аджарски на завтрак', priceLocal: 16, icon: '🧀', category: 'food', timeOfDay: 'morning' },
      { item: 'Порция хинкали (5 штук)', priceLocal: 12, icon: '🥟', category: 'food', timeOfDay: 'day' },
      { item: 'Сациви / Оджахури в духане', priceLocal: 24, icon: '🍲', category: 'food', timeOfDay: 'day' },
      { item: 'Кувшин домашнего вина (1 л)', priceLocal: 15, icon: '🍷', category: 'food', timeOfDay: 'night' },
      { item: 'Застолье в ресторане с шашлыком', priceLocal: 60, icon: '🥩', category: 'food', timeOfDay: 'night' },
      { item: 'Метро / автобус по карточке Metromoney', priceLocal: 1, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Канатная дорога к крепости Нарикала', priceLocal: 2.5, icon: '🚡', category: 'sightseeing', timeOfDay: 'day' },
      { item: 'Яндекс Go такси по Тбилиси', priceLocal: 8, icon: '🚕', category: 'transport', timeOfDay: 'all' },
      { item: 'Апартаменты в старом городе за ночь', priceLocal: 120, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Хинкали (порция)', cat: 'food', amountLocal: 14, timeOfDay: 'day' },
      { title: 'Хачапури и лимонад', cat: 'food', amountLocal: 20, timeOfDay: 'morning' },
      { title: 'Такси по Тбилиси (Bolt/Яндекс)', cat: 'transport_local', amountLocal: 9, timeOfDay: 'all' },
      { title: 'Пополнение карты метро Metromoney', cat: 'transport_local', amountLocal: 10, timeOfDay: 'all' },
      { title: 'Грузинское вино и сыр', cat: 'food', amountLocal: 35, timeOfDay: 'night' },
      { title: 'Ужин в национальном ресторане', cat: 'food', amountLocal: 55, timeOfDay: 'night' },
      { title: 'Серные бани в Абанотубани', cat: 'sightseeing', amountLocal: 80, timeOfDay: 'night' },
    ],
  },
  CN: {
    countryCode: 'CN',
    countryName: 'Китай',
    flag: '🇨🇳',
    currencyCode: 'CNY',
    currencySymbol: '¥',
    defaultCities: ['Пекин', 'Шанхай', 'Гуанчжоу', 'Шэньчжэнь', 'Чэнду'],
    cheatSheet: [
      { item: 'Чай в бутылке / Молочный чай с шариками', priceLocal: 15, icon: '🧋', category: 'food', timeOfDay: 'day' },
      { item: 'Цзяньбин (блинчик) на улице', priceLocal: 10, icon: '🥞', category: 'food', timeOfDay: 'morning' },
      { item: 'Порция сяолунбао (дамплинги на пару)', priceLocal: 25, icon: '🥟', category: 'food', timeOfDay: 'day' },
      { item: 'Лапша с говядиной Ланьчжоу', priceLocal: 28, icon: '🍜', category: 'food', timeOfDay: 'day' },
      { item: 'Утка по-пекински в ресторане', priceLocal: 190, icon: '🦆', category: 'food', timeOfDay: 'night' },
      { item: 'Хого (китайский самовар) на двоих', priceLocal: 240, icon: '🍲', category: 'food', timeOfDay: 'night' },
      { item: 'Поездка на метро (Alipay / WeChat Pay)', priceLocal: 4, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Поездка на скоростном поезде Fuxing', priceLocal: 280, icon: '🚄', category: 'transport', timeOfDay: 'all' },
      { item: 'Билет в Запретный город', priceLocal: 60, icon: '🏯', category: 'sightseeing', timeOfDay: 'day' },
      { item: 'Отель в центре за ночь', priceLocal: 450, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Лапша / дамплинги сяолунбао', cat: 'food', amountLocal: 30, timeOfDay: 'day' },
      { title: 'Уличный завтрак (цзяньбин / баоцзы)', cat: 'food', amountLocal: 12, timeOfDay: 'morning' },
      { title: 'Метро (WeChat / Alipay)', cat: 'transport_local', amountLocal: 5, timeOfDay: 'all' },
      { title: 'Молочный чай баббл-ти', cat: 'food', amountLocal: 18, timeOfDay: 'day' },
      { title: 'Ужин Хого / Утка по-пекински', cat: 'food', amountLocal: 140, timeOfDay: 'night' },
      { title: 'Такси Didi', cat: 'transport_local', amountLocal: 35, timeOfDay: 'all' },
      { title: 'Билет на Великую Стену / Музей', cat: 'sightseeing', amountLocal: 65, timeOfDay: 'day' },
    ],
  },
  KR: {
    countryCode: 'KR',
    countryName: 'Южная Корея',
    flag: '🇰🇷',
    currencyCode: 'KRW',
    currencySymbol: '₩',
    defaultCities: ['Сеул', 'Пусан', 'Чеджу', 'Инчхон'],
    cheatSheet: [
      { item: 'Банановое молоко в GS25 / CU', priceLocal: 1700, icon: '🥛', category: 'food', timeOfDay: 'all' },
      { item: 'Кимбап треугольный в конбини', priceLocal: 1500, icon: '🍙', category: 'food', timeOfDay: 'morning' },
      { item: 'Айс Американо (А-А)', priceLocal: 3500, icon: '☕', category: 'food', timeOfDay: 'day' },
      { item: 'Ттокпокки на ночном рынке Мёндон', priceLocal: 5000, icon: '🍢', category: 'food', timeOfDay: 'day' },
      { item: 'Кимчи тиге (острый суп) с рисом', priceLocal: 9500, icon: '🍲', category: 'food', timeOfDay: 'day' },
      { item: 'Корейское барбекю самгёпсаль (ужин)', priceLocal: 18000, icon: '🥩', category: 'food', timeOfDay: 'night' },
      { item: 'Курица чимэк с пивом соджу', priceLocal: 24000, icon: '🍗', category: 'food', timeOfDay: 'night' },
      { item: 'Метро Сеула по карте T-Money', priceLocal: 1400, icon: '🚇', category: 'transport', timeOfDay: 'all' },
      { item: 'Поезд KTX Сеул — Пусан', priceLocal: 59800, icon: '🚄', category: 'transport', timeOfDay: 'all' },
      { item: 'Отель в Мёндоне за ночь', priceLocal: 95000, icon: '🏨', category: 'stay', timeOfDay: 'night' },
    ],
    quickSuggestions: [
      { title: 'Кимбап и кофе в конбини', cat: 'food', amountLocal: 4500, timeOfDay: 'morning' },
      { title: 'Пополнение карты T-Money', cat: 'transport_local', amountLocal: 10000, timeOfDay: 'all' },
      { title: 'Стритфуд (ттокпокки, корндог)', cat: 'food', amountLocal: 6000, timeOfDay: 'day' },
      { title: 'Корейское барбекю (K-BBQ)', cat: 'food', amountLocal: 20000, timeOfDay: 'night' },
      { title: 'Корейская косметика Olive Young', cat: 'shopping', amountLocal: 35000, timeOfDay: 'day' },
      { title: 'Билет во дворец Кёнбоккун', cat: 'sightseeing', amountLocal: 3000, timeOfDay: 'day' },
    ],
  },
};

/**
 * Returns current time of day: morning, day, night
 */
export function getCurrentTimeOfDay(): 'morning' | 'day' | 'night' {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'day';
  return 'night';
}

/**
 * Detect country code from destination or currency
 */
export function detectCountryCode(destination: string, currency: string): string {
  const d = destination.toLowerCase();
  const c = currency.toUpperCase();

  if (d.includes('росси') || d.includes('russia') || d.includes('москв') || d.includes('дом') || d.includes('ежедневн') || c === 'RUB') return 'RU';
  if (d.includes('казах') || d.includes('kazakhstan') || d.includes('алмат') || d.includes('астан') || c === 'KZT') return 'KZ';
  if (d.includes('япон') || d.includes('japan') || d.includes('токио') || c === 'JPY') return 'JP';
  if (d.includes('таиланд') || d.includes('thailand') || d.includes('тай') || d.includes('пхукет') || c === 'THB') return 'TH';
  if (d.includes('турци') || d.includes('turkey') || d.includes('стамбул') || c === 'TRY') return 'TR';
  if (d.includes('оаэ') || d.includes('дубай') || d.includes('dubai') || d.includes('uae') || c === 'AED') return 'AE';
  if (d.includes('евро') || d.includes('париж') || d.includes('рим') || d.includes('испани') || c === 'EUR') return 'EU';
  if (d.includes('сша') || d.includes('usa') || d.includes('штат') || d.includes('нью-йорк') || c === 'USD') return 'US';
  if (d.includes('грузи') || d.includes('georgia') || d.includes('тбилиси') || c === 'GEL') return 'GE';
  if (d.includes('китай') || d.includes('china') || d.includes('пекин') || d.includes('шанхай') || c === 'CNY') return 'CN';
  if (d.includes('коре') || d.includes('korea') || d.includes('сеул') || c === 'KRW') return 'KR';

  return 'JP';
}
