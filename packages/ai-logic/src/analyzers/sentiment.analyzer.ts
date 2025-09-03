import { GeminiClient } from '../clients/gemini.client';

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  reasoning?: string;
  emotions?: string[];
}

export class SentimentAnalyzer {
  private geminiClient: GeminiClient;

  constructor(geminiClient: GeminiClient) {
    this.geminiClient = geminiClient;
  }

  public async analyze(text: string): Promise<SentimentResult> {
    try {
      const response = await this.geminiClient.analyzeSentiment(text);

      // Gemini 응답을 파싱
      try {
        const result = JSON.parse(response.text);
        return {
          sentiment: result.sentiment || 'neutral',
          confidence: result.confidence || response.confidence,
          reasoning: result.reasoning,
          emotions: result.emotions || [],
        };
      } catch (parseError) {
        // JSON 파싱 실패 시 기본값 반환
        console.warn('Failed to parse Gemini response:', parseError);
        return {
          sentiment: 'neutral',
          confidence: 0.5,
          reasoning: 'AI 응답 파싱 실패',
        };
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      throw error;
    }
  }

  public async batchAnalyze(texts: string[]): Promise<SentimentResult[]> {
    try {
      const results = await Promise.all(
        texts.map(text => this.analyze(text))
      );
      return results;
    } catch (error) {
      console.error('Batch sentiment analysis error:', error);
      throw error;
    }
  }

  public getEmotionScore(sentiment: string, confidence: number): number {
    const baseScore = confidence;
    switch (sentiment) {
      case 'positive':
        return baseScore;
      case 'negative':
        return -baseScore;
      default:
        return 0;
    }
  }

  public async extractKeywords(text: string): Promise<string[]> {
    try {
      const response = await this.geminiClient.extractKeywords(text);
      return response.keywords || [];
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return [];
    }
  }

  public async summarize(text: string): Promise<string> {
    try {
      const response = await this.geminiClient.summarize(text);
      return response.summary || '';
    } catch (error) {
      console.error('Summarization error:', error);
      return '';
    }
  }
}
