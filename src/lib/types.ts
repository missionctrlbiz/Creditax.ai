export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  tokensUsed?: number;
  createdAt: Date;
}

export interface Source {
  title: string;
  snippet: string;
  url?: string;
}

export interface ChatApiRequest {
  message: string;
  conversationId?: string;
}

export interface ChatApiResponse {
  reply: string;
  sources?: Source[];
  conversationId: string;
  tokensUsed: number;
  remainingToday: number;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: {
    title: string;
    url?: string;
    chunk_index: number;
  };
  similarity: number;
}

export interface UserWithTokens {
  id: string;
  email: string;
  tokens_used_today: number;
  daily_token_limit: number;
  last_token_reset: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MessageRecord {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  tokens_used?: number;
  created_at: string;
}

export type DocumentStatus = 'pending' | 'processing' | 'complete' | 'failed';

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  status: DocumentStatus;
  extracted_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DocumentApiResponse {
  documents: Document[];
}

export interface DocumentUploadResponse {
  document: Document;
}