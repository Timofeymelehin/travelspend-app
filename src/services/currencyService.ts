import { ExchangeRatesState } from '../types';

const RATES_CACHE_KEY = 'travelspend_exchange_rates_v1';

// Reliable default fallback rates (USD base)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  JPY: 153.2,
  RUB: 92.5,
  EUR: 0.92,
  THB: 36.5,
  TRY: 34.2,
  CNY: 7.24,
  KRW: 1385.0,
  AED: 3.67,
  GBP: 0.78,
  GEL: 2.7,
  KZT: 485.0,
};

export async function fetchExchangeRates(): Promise<ExchangeRatesState> {
  // Check cached rates first
  const cachedRaw = localStorage.getItem(RATES_CACHE_KEY);
  let cachedData: ExchangeRatesState | null = null;

  if (cachedRaw) {
    try {
      cachedData = JSON.parse(cachedRaw);
    } catch {
      // ignore
    }
  }

  // Try to fetch fresh rates if online
  if (navigator.onLine) {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.rates) {
          const freshState: ExchangeRatesState = {
            base: 'USD',
            rates: {
              ...FALLBACK_RATES,
              ...data.rates,
            },
            lastUpdated: new Date().toISOString(),
            isOffline: false,
          };
          localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(freshState));
          return freshState;
        }
      }
    } catch (e) {
      console.warn('Could not fetch live exchange rates, using cache/fallback:', e);
    }
  }

  // If fetch failed or offline, return cache or fallback
  if (cachedData) {
    return {
      ...cachedData,
      isOffline: true,
    };
  }

  return {
    base: 'USD',
    rates: FALLBACK_RATES,
    lastUpdated: 'Офлайн (базовые курсы)',
    isOffline: true,
  };
}

export function convertAmount(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
  customRate?: number,
  useManualRate?: boolean,
  localCurrencyCode?: string,
  baseCurrencyCode?: string
): number {
  if (fromCode === toCode) return amount;
  if (!amount || isNaN(amount)) return 0;

  // If manual rate is configured for the trip's local <-> base currency
  if (
    useManualRate &&
    customRate &&
    customRate > 0 &&
    localCurrencyCode &&
    baseCurrencyCode
  ) {
    // If converting from local to base: 1 local = customRate base
    if (fromCode === localCurrencyCode && toCode === baseCurrencyCode) {
      return amount * customRate;
    }
    // If converting from base to local:
    if (fromCode === baseCurrencyCode && toCode === localCurrencyCode) {
      return amount / customRate;
    }
  }

  // Cross-rate calculation via USD base
  const rateFrom = rates[fromCode] || FALLBACK_RATES[fromCode] || 1;
  const rateTo = rates[toCode] || FALLBACK_RATES[toCode] || 1;

  // amount in USD = amount / rateFrom
  // amount in target = amountInUSD * rateTo
  const inUSD = amount / rateFrom;
  return inUSD * rateTo;
}

export function getDirectRate(
  fromCode: string,
  toCode: string,
  rates: Record<string, number>,
  customRate?: number,
  useManualRate?: boolean
): number {
  if (useManualRate && customRate) {
    return customRate;
  }
  const rateFrom = rates[fromCode] || FALLBACK_RATES[fromCode] || 1;
  const rateTo = rates[toCode] || FALLBACK_RATES[toCode] || 1;
  return (1 / rateFrom) * rateTo;
}
