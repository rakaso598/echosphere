import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api', apiRoutes);

// 기본 라우트
app.get('/', (req, res) => {
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
