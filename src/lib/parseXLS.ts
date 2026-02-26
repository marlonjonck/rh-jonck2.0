import * as XLSX from 'xlsx';

export interface SolidesRow {
  'Nome'?: string;
  'Email Empresarial'?: string;
  'Email Pessoal'?: string;
  'Data de Nascimento'?: string;
  'Gênero'?: string;
  'Estado Civil'?: string;
  'Raça / Etnia'?: string;
  'Escolaridade'?: string;
  'Nacionalidade'?: string;
  'Naturalidade'?: string;
  'Celular'?: string;
  'Telefone de Emergência'?: string;
  'CEP'?: string;
  'Logradouro'?: string;
  'Número'?: string;
  'Complemento'?: string;
  'Bairro'?: string;
  'Cidade'?: string;
  'Estado'?: string;
  'Data de admissão'?: string;
  'Data de demissão'?: string;
  'Motivo da demissão'?: string;
  'Valor da Rescisão'?: string;
  'Tipo de contrato'?: string;
  'Salário'?: string;
  [key: string]: string | undefined;
}

export async function parseXLSFile(file: File): Promise<SolidesRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json<SolidesRow>(worksheet, {
          defval: '',
          raw: false,
        });
        
        resolve(jsonData);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsBinaryString(file);
  });
}

// Parse date from DD/MM/YYYY to YYYY-MM-DD
export function parseDateBR(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  
  // Handle various date formats
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
  
  // Remove R$, spaces, and handle Brazilian format
  const cleanValue = value
    .replace(/R\$\s*/g, '')
    .replace(/\s/g, '')
    .replace(/\./g, '') // Remove thousand separators
    .replace(',', '.'); // Convert decimal separator
  
  const num = parseFloat(cleanValue);
  return isNaN(num) ? null : num;
}
