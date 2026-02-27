// @ts-ignore - read-excel-file types
import readXlsxFile, { Row } from 'read-excel-file';

export interface SolidesRow {
  [key: string]: string | undefined;
}

export async function parseXLSFile(file: File): Promise<SolidesRow[]> {
  const rows: Row[] = await readXlsxFile(file);

  if (rows.length < 2) {
    return [];
  }

  // First row is headers
  const headers: string[] = rows[0].map((cell: unknown) => String(cell ?? ''));

  return rows.slice(1).map((row: Row) => {
    const obj: SolidesRow = {};
    headers.forEach((header: string, idx: number) => {
      obj[header] = row[idx] != null ? String(row[idx]) : '';
    });
    return obj;
  });
}

// Parse date from DD/MM/YYYY to YYYY-MM-DD
export function parseDateBR(dateStr: string | undefined): string | null {
  if (!dateStr) return null;

  const cleanDate = dateStr.trim();

  // DD/MM/YYYY format
  const brMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // YYYY-MM-DD format (already correct)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    return cleanDate;
  }

  return null;
}

// Parse currency from R$ X.XXX,XX to number
export function parseCurrencyBR(value: string | undefined): number | null {
  if (!value) return null;

  const cleanValue = value
    .replace(/R\$\s*/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const num = parseFloat(cleanValue);
  return isNaN(num) ? null : num;
}
