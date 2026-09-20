import { ExpenseItem } from '../types';
import { CATEGORIES } from '../data/categories';

export function exportExpensesToCSV(items: ExpenseItem[], tripName: string, baseCurrency: string, localCurrency: string): void {
  const headers = [
    'ID',
    'Название',
    'Категория',
    `Сумма (${localCurrency})`,
    `Сумма (${baseCurrency})`,
    'Дата',
    'Способ оплаты',
    'Город',
    'Заметки',
    'Кто платил',
  ];

  const paymentLabels: Record<string, string> = {
    cash: 'Наличные',
    card: 'Банковская карта',
    transit_card: 'Транспортная карта (Suica/IC)',
    prepaid: 'Оплачено заранее онлайн',
  };

  const rows = items.map((item) => {
    const categoryName = CATEGORIES[item.category]?.name || item.category;
    const payment = paymentLabels[item.paymentMethod] || item.paymentMethod;

    return [
      item.id,
      `"${(item.title || '').replace(/"/g, '""')}"`,
      `"${categoryName.replace(/"/g, '""')}"`,
      item.amountOriginal,
      item.amountBase,
      item.date,
      `"${payment}"`,
      `"${(item.locationCity || '').replace(/"/g, '""')}"`,
      `"${(item.notes || '').replace(/"/g, '""')}"`,
      `"${(item.paidBy || '').replace(/"/g, '""')}"`,
    ].join(';');
  });

  // UTF-8 BOM (\uFEFF) for Excel compatibility with Russian & Japanese characters
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  const cleanName = tripName.replace(/[^a-zA-Zа-яА-Я0-9_-]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `${cleanName}_расходы.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSVToExpenses(csvText: string, defaultLocal: string, defaultBase: string): Partial<ExpenseItem>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return [];

  const delimiter = lines[0].includes(';') ? ';' : ',';
  const result: Partial<ExpenseItem>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV row parser considering quotes
    const fields: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"') {
        if (inQuotes && line[c + 1] === '"') {
          current += '"';
          c++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length >= 2) {
      const title = fields[1] || fields[0] || 'Расход';
      const origAmount = parseFloat(fields[3]?.replace(',', '.') || fields[2]?.replace(',', '.') || '0') || 0;
      const baseAmount = parseFloat(fields[4]?.replace(',', '.') || fields[3]?.replace(',', '.') || '0') || 0;
      const dateStr = fields[5] || new Date().toISOString().slice(0, 10);

      result.push({
        id: `import-${Date.now()}-${i}`,
        title,
        category: 'misc',
        amountOriginal: origAmount,
        currencyOriginal: defaultLocal,
        amountBase: baseAmount || origAmount,
        date: dateStr,
        paymentMethod: 'card',
        locationCity: fields[7] || '',
        notes: fields[8] || '',
      });
    }
  }

  return result;
}
