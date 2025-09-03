import { createPostgresClientFromUrl } from '@echosphere/database';
import { AnalysisResult } from '@echosphere/common';

export class ReportRepository {
  private dbClient: any;

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required');
    }

    this.dbClient = createPostgresClientFromUrl(databaseUrl);
  }

  public async saveReport(report: AnalysisResult): Promise<AnalysisResult> {
    try {
      // Database 패키지의 PostgresClient 사용
      const savedReport = await this.dbClient.createReport({
        message: report.message,
        sentiment: report.sentiment,
        confidence: report.confidence,
        reasoning: report.reasoning,
        emotions: report.emotions,
        source: report.source,
        userId: report.userId,
        channelId: report.channelId,
      });

      return savedReport;
    } catch (error) {
      console.error('Save report error:', error);
      throw error;
    }
  }

  public async getAllReports(): Promise<AnalysisResult[]> {
    try {
      // Database 패키지의 PostgresClient 사용
      return await this.dbClient.getAllReports();
    } catch (error) {
      console.error('Get all reports error:', error);
      throw error;
    }
  }

  public async getReportById(id: string): Promise<AnalysisResult | null> {
    try {
      // Database 패키지의 PostgresClient 사용
      return await this.dbClient.getReportById(id);
    } catch (error) {
      console.error('Get report by id error:', error);
      throw error;
    }
  }

  public async getRecentReports(limit: number): Promise<any[]> {
    try {
      // Database 패키지의 PostgresClient에 getRecentReports가 있다고 가정
      return await this.dbClient.getRecentReports(limit);
    } catch (error) {
      console.error('Get recent reports error:', error);
      throw error;
    }
  }
}
