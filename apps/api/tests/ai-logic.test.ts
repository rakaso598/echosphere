import { SentimentAnalyzer } from '../../../packages/ai-logic/src/analyzers/sentiment.analyzer';

describe('SentimentAnalyzer', () => {
  const mockGeminiClient = {
    analyzeSentiment: async (text: string) => ({
      text: JSON.stringify({
        sentiment: text.includes('좋아') ? 'positive' : 'negative',
        confidence: 0.9,
        reasoning: '테스트용',
        emotions: text.includes('좋아') ? ['joy'] : ['sad'],
      }),
      confidence: 0.9,
    }),
  };
  const analyzer = new SentimentAnalyzer(mockGeminiClient as any);

  it('긍정적 텍스트 분석 결과', async () => {
    const result = await analyzer.analyze('이 영상 정말 좋아요!');
    expect(result.sentiment).toBe('positive');
  });

  it('부정적 텍스트 분석 결과', async () => {
    const result = await analyzer.analyze('별로인 것 같아요...');
    expect(result.sentiment).toBe('negative');
  });
});
