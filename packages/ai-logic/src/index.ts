export * from './clients/gemini.client';
export * from './analyzers/sentiment.analyzer';

// 편의 함수들
import { GeminiClient } from './clients/gemini.client';
import { SentimentAnalyzer } from './analyzers/sentiment.analyzer';

export function createSentimentAnalyzer(apiKey: string): SentimentAnalyzer {
  const geminiClient = new GeminiClient({ apiKey });
  return new SentimentAnalyzer(geminiClient);
}

export function createGeminiClient(apiKey: string): GeminiClient {
  return new GeminiClient({ apiKey });
}
