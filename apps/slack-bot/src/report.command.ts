import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const slackToken = process.env.SLACK_BOT_TOKEN;
const apiUrl = process.env.API_BASE_URL || 'http://localhost:3000';
const web = new WebClient(slackToken);

const MessageSchema = z.object({ message: z.string().min(1) });

export async function handleReportCommand(channel: string, message: string) {
  const parseResult = MessageSchema.safeParse({ message });
  if (!parseResult.success) {
    await web.chat.postMessage({ channel, text: '메시지 입력값이 올바르지 않습니다.' });
    return;
  }

  // API 서버에 분석 요청
  const response = await fetch(`${apiUrl}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  const result = await response.json();
  if (!result.success) {
    await web.chat.postMessage({ channel, text: '분석 요청에 실패했습니다.' });
    return;
  }
  const analysis = result.data;
  const text = `*감정 분석 결과*
- 메시지: ${analysis.message}
- 감정: ${analysis.sentiment}
- 신뢰도: ${analysis.confidence}
- 키워드: ${(analysis.keywords && analysis.keywords.length > 0) ? analysis.keywords.join(', ') : '-'}
- 추론: ${analysis.reasoning || '-'}`;
  await web.chat.postMessage({ channel, text });
}
