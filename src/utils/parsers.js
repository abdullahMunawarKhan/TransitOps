/**
 * TransitOps Shared Parser Utilities
 *
 * Problem: Teammate code stores costs in inconsistent formats:
 *   Vehicle.cost         → '$145,000'  (string)
 *   maintenanceLog.cost  → '$380'      (string)
 *   fuelLog.cost         → 510         (number)
 *   otherExpenses.cost   → 45          (number)   ← old records
 *   otherExpenses.amount → '$120.50'   (string)   ← new records from FuelExpensesView
 *
 * These two functions handle all variants and return a plain JS number.
 */

/**
 * Parse a currency/cost value to a plain number.
 * Handles: number, '$1,234.56', '1234.56', null, undefined → 0.
 */
export const parseCurrency = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  // Strip currency symbols, commas, spaces, keep digits and decimal point / minus
  const cleaned = String(val).replace(/[^0-9.\-]/g, '');
  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
};

/**
 * Parse a unit string value to a plain number.
 * Handles: 340, '340 L', '150 kWh', '124,500 mi', null → 0.
 */
export const parseNumeric = (val) => {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const cleaned = String(val).replace(/[^0-9.\-]/g, '');
  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
};

/**
 * Format a number as an INR currency string with Indian digit grouping.
 * Uses Intl.NumberFormat('en-IN') which natively produces lakh/crore grouping:
 *   e.g. 145000 → '₹1,45,000'
 * maximumFractionDigits: 0 — whole rupees only, no paise.
 */
export const formatCurrency = (val) => {
  const num = parseCurrency(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a number with commas (no currency symbol).
 * e.g. 1234567 → '1,234,567'
 */
export const formatNumber = (val) => {
  const n = parseNumeric(val);
  return new Intl.NumberFormat('en-US').format(n);
};

/**
 * Clamp a value to [min, max] inclusive.
 * Used for safety score edits: clamp(score, 0, 100)
 */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
