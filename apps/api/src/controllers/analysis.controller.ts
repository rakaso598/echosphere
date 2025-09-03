import { Request, Response } from 'express';
import { AnalysisService } from '../services/analysis.service';
import { AnalysisRequest, BaseResponse, ValidationError } from '@echosphere/common';

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  public async analyzeMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, source = 'api', userId, channelId } = req.body;

      if (!message) {
        const response: BaseResponse = {
          success: false,
          error: 'Message is required'
        };
        res.status(400).json(response);
        return;
      }

      const request: AnalysisRequest = {
        message,
        source,
        userId,
        channelId
      };

      const result = await this.analysisService.analyzeMessage(request);

      const response: BaseResponse = {
        success: true,
        data: result,
        message: 'Analysis completed successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Analysis error:', error);

      const response: BaseResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      };

      res.status(500).json(response);
    }
  }

  public async getReports(req: Request, res: Response): Promise<void> {
    try {
      const reports = await this.analysisService.getReports();
      res.json(reports);
    } catch (error) {
      console.error('Get reports error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getReportById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Report ID is required' });
        return;
      }
      const report = await this.analysisService.getReportById(id);
      if (!report) {
        res.status(404).json({ error: 'Report not found' });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error('Get report by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
