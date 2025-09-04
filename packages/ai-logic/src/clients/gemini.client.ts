import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GeminiConfig {
  apiKey: string;
  model?: string;
}

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  private model: string;

  constructor(config: GeminiConfig) {
    this.genAI = new GoogleGenerativeAI(config.apiKey);
    this.model = process.env.GEMINI_MODEL || config.model || 'gemini-2.5-flash';
  }

  public async generateContent(prompt: string): Promise<{ text: string }> {
    const model = this.genAI.getGenerativeModel({ model: this.model });
    const result = await model.generateContent(prompt);
    return { text: result.response.text() };
  }

  public async analyzeSentiment(text: string): Promise<{ text: string }> {
    const prompt = `다음 텍스트의 감정을 분석해주세요. 응답은 JSON 형식으로 해주세요:\n{\n  "sentiment": "positive|negative|neutral",\n  "confidence": 0.0-1.0,\n  "reasoning": "분석 근거"\n}\n\n텍스트: "${text}"`;
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
