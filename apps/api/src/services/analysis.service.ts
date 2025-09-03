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

  // 위험 감지 및 경고 알림 (예시)
  public async detectAndNotifyRisk(): Promise<void> {
    // 최근 20개 메시지 조회
    const recentReports = await this.reportRepository.getRecentReports(20);
    const negativeCount = recentReports.filter(r => r.sentiment === 'negative').length;
    const ratio = recentReports.length > 0 ? negativeCount / recentReports.length : 0;
    if (ratio >= 0.5) {
      // 경고 알림 전송 (디스코드/슬랙)
      await this.sendRiskAlert(`⚠️ 최근 20개 메시지 중 부정적 반응이 ${Math.round(ratio * 100)}% 감지되었습니다!`);
    }
  }

  // 실제 알림 전송 로직 (예시, 봇 API 호출 등)
  private async sendRiskAlert(message: string): Promise<void> {
    // 디스코드 Webhook 알림
    const discordWebhook = process.env.DISCORD_WEBHOOK_URL;
    if (discordWebhook) {
      await fetch(discordWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      });
    }
    // 슬랙 Webhook 알림
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });
    }
    // 콘솔에도 출력
    console.log('Risk Alert:', message);
  }
}
