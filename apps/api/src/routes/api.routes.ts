import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';

const router = Router();
const analysisController = new AnalysisController();

// 메시지 분석 엔드포인트
router.post('/analyze', (req, res) => {
  analysisController.analyzeMessage(req, res);
});

// 리포트 조회 엔드포인트
router.get('/reports', (req, res) => {
  analysisController.getReports(req, res);
});

export default router;
