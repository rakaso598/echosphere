import { ReportRepository } from '../repositories/report.repository';
import { createSentimentAnalyzer } from '@echosphere/ai-logic';
import { AnalysisResult, AnalysisRequest } from '@echosphere/common';

export class AnalysisService {
  private reportRepository: ReportRepository;
  private sentimentAnalyzer: any;

  constructor() {
    this.reportRepository = new ReportRepository();

    // Gemini API 키 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required');
    }

    this.sentimentAnalyzer = createSentimentAnalyzer(apiKey);
  }

  public async analyzeMessage(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      // AI 분석 로직 실행 (packages/ai-logic 사용)
      const sentimentResult = await this.sentimentAnalyzer.analyze(request.message);

      const analysisResult: AnalysisResult = {
        id: '', // 저장 후 DB에서 생성된 ID가 할당됨
        message: request.message,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        reasoning: sentimentResult.reasoning,
        emotions: sentimentResult.emotions,
        keywords: [], // TODO: 키워드 추출 로직 추가
        source: request.source,
        userId: request.userId,
        channelId: request.channelId,
        createdAt: new Date(),
      };

      // 결과를 데이터베이스에 저장
      const savedResult = await this.reportRepository.saveReport(analysisResult);

      return savedResult;
    } catch (error) {
      console.error('Analysis service error:', error);
      throw error;
    }
  }

  public async getReports(): Promise<any[]> {
    try {
      return await this.reportRepository.getAllReports();
    } catch (error) {
      console.error('Get reports service error:', error);
      throw error;
    }
  }

  public async getReportById(id: string): Promise<any> {
    try {
      return await this.reportRepository.getReportById(id);
    } catch (error) {
      console.error('Get report by ID service error:', error);
      throw error;
    }
  }
}
