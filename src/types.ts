export type PaymentMethod = 'cash' | 'card' | 'transit_card' | 'prepaid';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToUSD: number; // For fallback conversion
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amountOriginal: number; // In local currency (e.g., JPY)
  currencyOriginal: string;
  amountBase: number;     // In base currency (e.g., RUB)
  date: string;           // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  locationCity?: string;
  notes?: string;
  isPlanned?: boolean;    // true if future planned, false if already spent
  paidBy?: string;        // Who paid (for group travel)
}

export interface Trip {
  id: string;
  name: string;
  destination: string;
  flag: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;    // e.g. 'RUB'
  localCurrency: string;   // e.g. 'JPY'
  customExchangeRate?: number; // Custom rate: 1 local = X base (e.g. 1 JPY = 0.62 RUB)
  useManualRate: boolean;
  totalBudgetBase: number; // Budget in base currency
  travelersCount: number;  // For per-person breakdown
  items: ExpenseItem[];
}

export interface ExchangeRatesState {
  base: string;
  rates: Record<string, number>;
  lastUpdated: string;
  isOffline: boolean;
}
