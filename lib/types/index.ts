// Shared TypeScript interfaces — Voca
// Import from @/lib/types everywhere — never redefine inline.

export interface TranscriptionResult {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  rawTranscription: string;
  optimizedPrompt: string;
  createdAt: string; // ISO 8601
}

export interface TranscriptionListItem {
  id: string;
  filename: string;
  durationSeconds: number | null;
  wordCount: number;
  createdAt: string; // ISO 8601
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export type TranscriptionMetadata = {
  source: 'whatsapp' | 'upload';
  model: string;
  optimizedAt?: string; // ISO 8601
};
