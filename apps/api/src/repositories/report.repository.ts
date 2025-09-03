import { createPostgresClientFromUrl } from '@echosphere/database';
import { AnalysisResult } from '@echosphere/common';
import { ReportSchema, CreateReportInputSchema } from '@echosphere/database/src/models/report.model';

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
      // 입력값 검증
      const parseResult = CreateReportInputSchema.safeParse(report);
      if (!parseResult.success) {
        throw new Error('DB 저장 입력값 검증 실패: ' + JSON.stringify(parseResult.error.issues));
      }
      // Database 패키지의 PostgresClient 사용
      const savedReport = await this.dbClient.createReport(parseResult.data);
      // 출력값 검증
      const outputResult = ReportSchema.safeParse(savedReport);
      if (!outputResult.success) {
        throw new Error('DB 저장 결과 검증 실패: ' + JSON.stringify(outputResult.error.issues));
      }
      const output = outputResult.data;
      return {
        ...output,
        reasoning: output.reasoning ?? '',
        userId: output.userId ?? '',
        channelId: output.channelId ?? '',
        emotions: output.emotions ?? [],
      };
    } catch (error) {
      console.error('Save report error:', error);
      throw error;
    }
  }

  public async getAllReports(): Promise<AnalysisResult[]> {
    try {
      const reports = await this.dbClient.getAllReports();
      // 출력값 검증
      return reports.filter((r: any) => ReportSchema.safeParse(r).success).map((r: any) => ({
        ...r,
        reasoning: r.reasoning ?? '',
        userId: r.userId ?? '',
        channelId: r.channelId ?? '',
        emotions: r.emotions ?? [],
      }));
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
