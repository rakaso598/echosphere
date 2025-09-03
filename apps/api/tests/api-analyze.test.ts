import request from 'supertest';
import express from 'express';

// 테스트용 mock AnalysisController
const app = express();
app.use(express.json());

app.post('/api/analyze', (req, res) => {
  const { message, source, userId, channelId } = req.body;
  if (!message || !source || !userId || !channelId) {
    return res.status(400).json({ success: false });
  }
  // 실제 DB/AI 분석 없이 mock 결과 반환
  return res.status(200).json({
    success: true,
    data: {
      sentiment: message.includes('좋아') ? 'positive' : 'negative',
      confidence: 0.9,
      reasoning: '테스트용',
      emotions: message.includes('좋아') ? ['joy'] : ['sad'],
      message,
      source,
      userId,
      channelId,
      createdAt: new Date().toISOString()
    }
  });
});

describe('POST /api/analyze (mock)', () => {
  it('정상 요청 시 200 응답', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        message: '테스트 메시지 좋아!',
        source: 'discord',
        userId: '123',
        channelId: '456'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sentiment).toBe('positive');
  });

  it('잘못된 요청 시 400 응답', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({}); // 필수값 누락
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
