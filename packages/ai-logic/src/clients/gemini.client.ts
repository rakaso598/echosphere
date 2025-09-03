import { z } from 'zod';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export interface GeminiResponse {
  text: string;
  confidence: number;
}

export const GeminiResponseSchema = z.object({
  text: z.string(),
  confidence: z.number().min(0).max(1),
});

export class GeminiClient {
  private apiKey: string;
  private model: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(config: GeminiConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'gemini-pro';
  }

  public async generateContent(prompt: string): Promise<GeminiResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      // Zod 검증
      const parseResult = GeminiResponseSchema.safeParse(data);
      if (!parseResult.success) {
        throw new Error('Gemini API 응답 검증 실패: ' + JSON.stringify(parseResult.error.issues));
      }
      return parseResult.data;
    } catch (error) {
      console.error('Gemini client error:', error);
      throw error;
    }
  }

  public async analyzeSentiment(text: string): Promise<GeminiResponse> {
    const prompt = `
다음 텍스트의 감정을 분석해주세요. 응답은 JSON 형식으로 해주세요:
{
  "sentiment": "positive|negative|neutral",
  "confidence": 0.0-1.0,
  "reasoning": "분석 근거"
}

텍스트: "${text}"
`;

    return this.generateContent(prompt);
  }

  public async extractKeywords(text: string): Promise<{ keywords: string[] }> {
    const prompt = `다음 텍스트에서 핵심 키워드를 추출해 JSON 배열로 반환하세요: ${text}`;
    const response = await this.generateContent(prompt);
    try {
      const result = JSON.parse(response.text);
      return { keywords: result.keywords || [] };
    } catch {
      return { keywords: [] };
    }
  }

  public async summarize(text: string): Promise<{ summary: string }> {
    const prompt = `다음 텍스트를 한 문장으로 요약해 JSON으로 반환하세요: ${text}`;
    const response = await this.generateContent(prompt);
    try {
      const result = JSON.parse(response.text);
      return { summary: result.summary || '' };
    } catch {
      return { summary: '' };
    }
  }
}
