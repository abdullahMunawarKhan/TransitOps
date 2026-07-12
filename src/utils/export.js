/**
 * TransitOps CSV Export Utility
 *
 * Generates a client-side CSV download using Blob.
 *
 * @param {Object[]} data         - Array of row objects
 * @param {Object[]} columns      - Array of { label: string, key: string | (row) => string }
 * @param {string}   filename     - Desired filename without extension
 *
 * Column key can be a string (object property name) or a function that
 * receives the row object and returns the cell string.
 *
 * Usage example:
 *   exportToCSV(
 *     drivers,
 *     [
 *       { label: 'Driver Name', key: 'name' },
 *       { label: 'Safety Score', key: 'safetyScore' },
 *       { label: 'License Expiry', key: 'licenseExpiry' },
 *       { label: 'Status', key: (row) => row.status },
 *     ],
 *     'license-expiry-report'
 *   );
 */
export const exportToCSV = (data, columns, filename = 'report') => {
  if (!data || data.length === 0) return;

  const escape = (val) => {
    const str = val === null || val === undefined ? '' : String(val);
    // Wrap in quotes if contains comma, newline, or double-quote
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((col) => escape(col.label)).join(',');

  const rows = data.map((row) =>
    columns
      .map((col) => {
        const val = typeof col.key === 'function' ? col.key(row) : row[col.key];
        return escape(val);
      })
      .join(',')
  );

  const csv = [header, ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
