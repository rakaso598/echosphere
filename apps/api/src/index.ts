import dotenv from 'dotenv';
dotenv.config({ path: './apps/api/.env' });

import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { check, validationResult } from 'express-validator';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3000;

// 환경변수 검증
const EnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(10),
  DATABASE_URL: z.string().url(),
  PORT: z.string().regex(/^\d+$/).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),
  SLACK_WEBHOOK_URL: z.string().url().optional(),
});

const envParse = EnvSchema.safeParse(process.env);
if (!envParse.success) {
  console.error('환경변수 검증 실패:', envParse.error.issues);
  process.exit(1);
}

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 보안 미들웨어 설정
app.use(helmet());

// 요청 속도 제한 (예: 15분당 1000회)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
}));

// 라우트 설정
app.use('/api', apiRoutes);

// 기본 라우트
app.get('/', [
  check('test').optional().isString()
], (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  res.json({
    message: 'EchoSphere API Server',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /api/analyze',
      reports: 'GET /api/reports'
    }
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 EchoSphere API server running on port ${PORT}`);
});

export default app;
