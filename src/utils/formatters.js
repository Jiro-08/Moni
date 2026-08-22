// ==============================================================================
// Currency and Date Formatting Utilities
// ==============================================================================

export const CURRENCY_SYMBOLS = {
  PHP: '₱',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
  SGD: 'S$'
};

/**
 * Format numeric amount into currency string
 * @param {number} amount
 * @param {string} symbol - e.g. '₱' or '$'
 * @returns {string}
 */
export function formatCurrency(amount, symbol = '₱') {
  if (amount === undefined || amount === null || isNaN(amount)) return `${symbol}0.00`;
  const num = Number(amount);
  const formatted = Math.abs(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${num < 0 ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format ISO date string or Date object
 * @param {string|Date} date
 * @param {string} formatType - 'short' | 'medium' | 'long'
 */
export function formatDate(date, formatType = 'medium') {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  if (formatType === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  if (formatType === 'long') {
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format date for input elements (YYYY-MM-DD)
 */
export function formatInputDate(date = new Date()) {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

/**
 * Format Month & Year for budget periods (e.g., 'August 2026')
 */
export function formatMonthYear(date = new Date()) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
