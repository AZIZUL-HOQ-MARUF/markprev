export type DocumentType = 'mermaid' | 'markdown';

export interface DocumentRecord {
  id: string;
  title: string;
  type: DocumentType;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  errorLine?: number;
  errorDetails?: string;
}

export type ExportFormat = 'svg' | 'png' | 'raw';
export type PngScale = 1 | 2 | 3 | 4;

export interface ExportOptions {
  format: ExportFormat;
  scale?: PngScale;
  filename: string;
}
