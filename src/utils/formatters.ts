export function formatCurrency(
  amount: number,
  currencyCode: string,
  options?: { showDecimals?: boolean; compact?: boolean; isMasked?: boolean }
): string {
  const symbols: Record<string, string> = {
    RUB: '₽',
    JPY: '¥',
    USD: '$',
    EUR: '€',
    THB: '฿',
    TRY: '₺',
    CNY: '¥',
    KRW: '₩',
    GBP: '£',
  };

  const symbol = symbols[currencyCode] || currencyCode;

  if (options?.isMasked) {
    return `•••• ${symbol}`;
  }

  const isZeroDecimalCurrency = ['JPY', 'KRW'].includes(currencyCode);
  const showDecimals = options?.showDecimals ?? !isZeroDecimalCurrency;

  if (options?.compact && amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
  }
  if (options?.compact && amount >= 10000) {
    return `${(amount / 1000).toFixed(0)}k ${symbol}`;
  }

  const formattedNum = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);

  // Position symbol based on convention
  if (['$', '€', '£'].includes(symbol)) {
    return `${symbol}${formattedNum}`;
  }
  return `${formattedNum} ${symbol}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short',
  }).format(date);
}

export function formatDateShort(dateString: string): string {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}.${parts[1]}`;
  }
  return dateString;
}
