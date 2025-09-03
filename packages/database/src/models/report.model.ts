export interface Report {
  id: string;
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning?: string;
  emotions?: string[];
  source: 'discord' | 'slack' | 'api';
  userId?: string;
  channelId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportInput {
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning?: string;
  emotions?: string[];
  source: 'discord' | 'slack' | 'api';
  userId?: string;
  channelId?: string;
}

export interface UpdateReportInput {
  message?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  confidence?: number;
  reasoning?: string;
  emotions?: string[];
  source?: 'discord' | 'slack' | 'api';
  userId?: string;
  channelId?: string;
}

// 데이터베이스 테이블 스키마 (SQL)
export const reportTableSchema = `
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  reasoning TEXT,
  emotions JSONB,
  source VARCHAR(20) NOT NULL CHECK (source IN ('discord', 'slack', 'api')),
  user_id VARCHAR(255),
  channel_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_sentiment ON reports(sentiment);
CREATE INDEX IF NOT EXISTS idx_reports_source ON reports(source);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
`;
